import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Sample} from '../../shared/models/sample';
import {SampleService} from '../../core/services/sample.service';
import {FormBuilder} from '@angular/forms';
import {MetadataField} from '../../shared/models/metadata-field';
import {MetadataFieldService} from '../../core/services/metadata-field.service';
import {Observable} from 'rxjs';
import {TagService} from '../../core/services/tag.service';
import {SampleStatistics} from '../../shared/models/sample-statistics';
import {ProjectService} from '../../core/services/project.service';
import {Project} from '../../shared/models/project';
import {MetadataValueService} from '../../core/services/metadataValue.service';
import {TagTreeNode} from '../../shared/models/tags-tree';
import {KEYS, TREE_ACTIONS} from 'angular-tree-component';
import {ActivatedRoute, Router} from '@angular/router';
import {ExportToCsv} from 'export-to-csv';


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
  public searchTerm = '';
  public metadataFields: MetadataField[];
  public filteredFields: Observable<MetadataField[]>[] = [];
  public filteredTags: string[] = [];
  private project: Project;
  public metadataValues = {};
  public fieldsMap = new Map<string, string>();

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
    this.project = await this.projectService.getProject();

    this.metadataFieldService.getMetadataFieldsByProject(this.project).subscribe(value => {
      this.metadataFields = value;
      this.metadataFields.forEach(field => {
        if (!field.privateField) {
          this.fieldsMap.set(field.name, '');
          this.getMetadataValues(field.name);
        }
      });
      this.fillFormWithRouteParamsAndFilterSamples();
    });

    this.tagService.getTagHierarchyTree(this.project).subscribe(
      tagsTree => this.tagNodes = tagsTree.roots
    );

  }

  filter(updateRoute = true) {
    if (updateRoute) {
      this.updateRoute();
    }

    this.sampleService.filterSamples(this.project, this.searchTerm, this.fieldsMap, this.filteredTags).subscribe(
      (samples: Sample[]) => {
        this.emitResults.emit(samples);
      });

    this.sampleService.getFilterStatistics(this.project, this.searchTerm, this.fieldsMap, this.filteredTags).subscribe(
      (value: SampleStatistics) => this.emitStatistics.emit(value)
    );
  }

  getMetadataValues(name: string) {
    this.metadataValuesService.findDistinctValuesByFieldName(name).subscribe(
      value => {
          this.metadataValues[name] = value.values ? value.values : [];
      }
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

  private updateRoute() {
    const queryParams = {};
    if (this.searchTerm) {
      queryParams['word'] = this.searchTerm;
    }
    if (this.filteredTags && this.filteredTags.length > 0) {
      queryParams['tags'] = this.filteredTags.join(',');
    }
    this.fieldsMap.forEach((value, field) => {
      if (value !== '') {
        queryParams[field] = value;
      }
    });
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
      this.searchTerm = params['word'];
    }
    if (params['tags']) {
      this.filteredTags = (<string>params['tags']).split(',');
    }
    for (const field in params) {
      if (field !== 'word' && field !== 'tags'
        && params.hasOwnProperty(field) && this.fieldsMap.get(field) !== undefined) {
        this.fieldsMap.set(field, params[field]);
      }
    }
    this.filter(false);
  }

  exportCSV() {
    const options = {
      fieldSeparator: ';',
      filename: 'export.csv',
      quoteStrings: '"',
      decimalSeparator: '.',
      showLabels: true,
      showTitle: true,
      useTextFile: false,
      useBom: true,
      useKeysAsHeaders: true,
    };
    if (this.searchTerm || this.filteredTags.length > 0) {
      this.sampleService.filterSamples(this.project, this.searchTerm, this.fieldsMap, this.filteredTags, true)
        .subscribe(async value => {
          const samples = await this.sampleService.convertToFilteredSamples(value, this.searchTerm, this.filteredTags);
          const formattedSamples = samples.map(value1 => {
            return value1.textFragments.map(value2 => {
              return {id: value1.id, beforeMatch: value2.beforeWord, match: value2.word, afterMatch: value2.afterWord};
            });
          });
          const exporter = new ExportToCsv(options);
          exporter.generateCsv([].concat(...formattedSamples));
        });
    } else {
      this.sampleService.filterSamples(this.project, this.searchTerm, this.fieldsMap, this.filteredTags, true)
        .subscribe(value => {
          const formattedSamples = value.map(value1 => {
            return {id: value1.id, text: value1.text};
          });
          const exporter = new ExportToCsv(options);
          exporter.generateCsv([].concat(...formattedSamples));
        });
    }

  }
}
