import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FilteredSample, Sample} from '../../shared/models/sample';
import {SampleService} from '../../core/services/sample.service';
import {map, startWith} from 'rxjs/operators';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {MetadataField} from '../../shared/models/metadata-field';
import {MetadataFieldService} from '../../core/services/metadata-field.service';
import {Observable} from 'rxjs';
import {Tag} from '../../shared/models/tag';
import {TagService} from '../../core/services/tag.service';
import {SampleStatistics} from '../../shared/models/sample-statistics';
import {ProjectService} from '../../core/services/project.service';
import {Project} from '../../shared/models/project';
import {MetadataValue} from '../../shared/models/metadataValue';
import {MetadataValueService} from '../../core/services/metadataValue.service';
import {TagTreeNode} from '../../shared/models/tags-tree';
import {KEYS, TREE_ACTIONS} from 'angular-tree-component';
import {ActivatedRoute, Router} from '@angular/router';


@Component({
  selector: 'app-sample-search',
  templateUrl: './sample-search.component.html',
  styleUrls: ['./sample-search.component.css']
})
export class SampleSearchComponent implements OnInit {
  @Input()
  samples: Sample[];
  @Output()
  emitResults: EventEmitter<any> = new EventEmitter();
  @Output()
  emitStatistics: EventEmitter<any> = new EventEmitter();

  public errorMessage: string;
  public searchTerm: string;
  public filterForm: FormGroup;
  public metadataFields: MetadataField[];
  public filteredFields: Observable<MetadataField[]>[] = [];
  public filteredTags: string[] = [];
  private project: Project;
  public metadataValues: string[][] = [];

  public tagNodes: TagTreeNode[];
  public options = {
    animateExpand: true,
    actionMapping: {
      mouse: {
        dblClick: (tree, node, $event) => {
          if (node.hasChildren) {
            TREE_ACTIONS.TOGGLE_EXPANDED(tree, node, $event);
          }
        }
      },
      keys: {
        [KEYS.ENTER]: (tree, node, $event) => {
          node.expandAll();
        }
      }
    },
    scrollOnActivate: true,
  };

  constructor(private sampleService: SampleService,
              private metadataFieldService: MetadataFieldService,
              private tagService: TagService,
              private formBuilder: FormBuilder,
              private projectService: ProjectService,
              private metadataValuesService: MetadataValueService,
              private activatedRoute: ActivatedRoute,
              private router: Router) {
  }

  async ngOnInit() {
    this.filterForm = this.formBuilder.group({
      word: '',
      metadata: this.formBuilder.array([]),
      annotations: this.formBuilder.array([])
    });

    this.project = await this.projectService.getProject();

    this.metadataFieldService.getMetadataFieldsByProject(this.project).subscribe(value => {
      this.metadataFields = value;
      this.addMetadataForm();
    });

    this.tagService.getTagHierarchyTree(this.project).subscribe(
      tagsTree => this.tagNodes = tagsTree.roots
    );

    this.fillFormWithRouteParamsAndFilterSamples();
  }

  filter(updateRoute = true) {
    this.searchTerm = this.filterForm.get('word').value;
    const metadata: [string, string][] = new Array<[string, string]>();
    this.filterForm.get('metadata').value.forEach(value => {
      if (value['field'] !== '' && value['value'] !== '') {
        metadata.push([value['field'], value['value']]);
      }
    });

    if (updateRoute) {
      this.updateRoute(this.searchTerm, metadata, this.filteredTags);
    }

    this.sampleService.filterSamples(this.project, this.searchTerm, metadata, this.filteredTags).subscribe(
      (samples: Sample[]) => {
        this.emitResults.emit(samples);
      });

    this.sampleService.getFilterStatistics(this.project, this.searchTerm, metadata, this.filteredTags).subscribe(
      (value: SampleStatistics) => this.emitStatistics.emit(value)
    );
  }

  get metadataForm() {
    return this.filterForm.get('metadata') as FormArray;
  }

  get annotationsForm() {
    return this.filterForm.get('annotations') as FormArray;
  }

  addMetadataForm(field = '', value = '') {
    this.metadataForm.push(this.formBuilder.group({
      field: field,
      value: value,
    }));

    this.filteredFields.push(this.metadataForm.at(this.metadataForm.length - 1).get('field').valueChanges.pipe(
      startWith(''),
      map(fieldName => this._filterMetadata(fieldName))
    ));

    this.metadataValues.push([]);
  }

  removeMetadataField(i: number) {
    this.metadataForm.removeAt(i);
    this.filteredFields.splice(i, 1);
    this.metadataValues.splice(i, 1);
  }

  private _filterMetadata(value: string): MetadataField[] {
    const filterValue = value.toLowerCase();

    if (!this.metadataFields) {
      return [];
    }
    return this.metadataFields.filter(field => field.name.toLowerCase().includes(filterValue));
  }

  getMetadataValues(name: string, i: number) {
    this.metadataValuesService.findDistinctValuesByFieldName(name).subscribe(
      value => this.metadataValues[i] = value.values ? value.values : []
    );
  }

  filterValues(metadataValue: string[], value: string): string[] {
    return metadataValue.filter(v => v.includes(value));
  }

  onTagSelected(node) {
    this.filteredTags.push(node.data.name);
  }

  deleteTag(i: number) {
    this.filteredTags.splice(i, 1);
  }

  private updateRoute(searchTerm: string, metadata: [string, string][], filteredTags: string[]) {
    const queryParams = {};
    if (searchTerm) {
      queryParams['word'] = searchTerm;
    }
    if (filteredTags && filteredTags.length > 0) {
      queryParams['tags'] = filteredTags.join(',');
    }
    metadata.forEach(([field, value]) => queryParams[field] = value);
    this.router.navigate([],
      {
        relativeTo: this.activatedRoute,
        queryParams: queryParams
      });
  }

  private fillFormWithRouteParamsAndFilterSamples() {
    const params = this.activatedRoute.snapshot.queryParams;
    if (Object.entries(params).length === 0) {
      return;
    }
    if (params['word']) {
      this.filterForm.get('word').setValue(params['word']);
    }
    if (params['tags']) {
      this.filteredTags = (<string>params['tags']).split(',');
    }
    for (const field in params) {
      if (field !== 'word' && field !== 'tags'
        && params.hasOwnProperty(field)) {
        this.addMetadataForm(field, params[field]);
      }
    }
    this.filter();
  }
}
