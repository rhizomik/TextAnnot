import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FilteredSample, Sample} from '../../shared/models/sample';
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
import {AuthenticationBasicService} from '../../core/services/authentication-basic.service';
import { debounceTime, distinctUntilChanged, flatMap, map } from 'rxjs/operators';
import {forkJoin} from 'rxjs/internal/observable/forkJoin';
import { MetadataValue } from '../../shared/models/metadataValue';
import { of } from 'rxjs/internal/observable/of';
import { Element } from '@angular/compiler';
import { Subject } from 'rxjs/internal/Subject';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { merge } from 'rxjs/internal/observable/merge';


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
  public filteredTags: TagTreeNode[] = [];
  private project: Project;
  public metadataValues = {};
  public focusEvents = {};
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
              private router: Router,
              private authService: AuthenticationBasicService) {
  }

  async ngOnInit() {
    this.project = await this.projectService.getProject();

    this.metadataFieldService.getMetadataFieldsByProject(this.project).subscribe(value => {
      this.metadataFields = value;
      this.metadataFields.forEach(field => {
        if (!field.privateField) {
          this.fieldsMap.set(field.name, '');
          this.focusEvents[field.name] = new Subject<string>();
          this.getMetadataValues(field.name);
        }
      });
      this.fillFormWithRouteParamsAndFilterSamples();
    });

    this.tagService.getTagHierarchyTree(this.project).subscribe(
      tagsTree => this.tagNodes = tagsTree.roots
    );
  }

  isLoggedIn() {
    return this.authService.isLoggedIn();
  }

  filter(updateRoute = true) {
    if (updateRoute) {
      this.updateRoute();
    }
    this.sampleService.filterSamples(this.project, this.searchTerm, this.fieldsMap, this.filteredTags.map(value => value.id)).subscribe(
      (samples: Sample[]) => {
        this.emitResults.emit(samples);
      });
    this.sampleService.getFilterStatistics(this.project, this.searchTerm, this.fieldsMap,
      this.filteredTags.map(value => value.id)).subscribe(
      (value: SampleStatistics) => this.emitStatistics.emit(value)
    );
  }

  getMetadataValues(name: string) {
    this.metadataValuesService.findDistinctValuesByFieldName(name).subscribe(
      value => this.metadataValues[name] = value.values ? value.values : []);
  }

  autocompleteField(metadataField: string): (text: Observable<string>) => Observable<any[]> {
    const autocompleteFieldValues = (text$: Observable<string>) => {
      const debouncedText$ = text$.pipe(debounceTime(200), distinctUntilChanged());
      return merge(debouncedText$, this.focusEvents[metadataField]).pipe(
        map(term => this.metadataValues[metadataField].filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1)));
    };
    return autocompleteFieldValues;
  }

  clearIfNothingSelected(fieldName: string, target: HTMLInputElement) {
    if (target.value !== this.fieldsMap.get(fieldName)) {
      target.value = '';
      this.fieldsMap.set(fieldName, '');
    }
  }

  onTagSelected(node) {
    if (!this.filteredTags.map(value => value.id).includes(node.data.id)) {
      this.filteredTags.push(node.data);
    }
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
      queryParams['tags'] = this.filteredTags.map(value => value.id).join(',');
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
      const tagIds = (<string>params['tags']).split(',');
      this.filteredTags = tagIds.map(value => <TagTreeNode> {id: +value});
      this.filteredTags.map(filteredTag => {
        this.tagService.get(filteredTag.id).subscribe(tag => filteredTag.name = tag.name);
      });
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
      filename: 'export',
      quoteStrings: '"',
      decimalSeparator: '.',
      showLabels: true,
      showTitle: false,
      useTextFile: false,
      useBom: true,
      useKeysAsHeaders: true,
    };
    if (this.searchTerm || this.filteredTags.length > 0) {
      this.sampleService.filterSamples(
        this.project, this.searchTerm, this.fieldsMap, this.filteredTags.map(value => value.id), true).pipe(
          flatMap((samples: Sample[]) =>
            forkJoin(samples.map(sample =>
              this.metadataValuesService.findByForA(sample).pipe(map(values => {
                sample.has = values;
                return sample;
              }))))),
          flatMap((samples: Sample[]) =>
            this.sampleService.convertToFilteredSamples(samples, this.searchTerm, this.filteredTags.map(value1 => value1.id)))
        ).subscribe((filteredSamples: FilteredSample[]) => {
          const exporter = new ExportToCsv(options);
          exporter.generateCsv([].concat(...filteredSamples.map(filteredSample =>
            filteredSample.textFragments.map(fragment =>
            ({
              'id': this.findMetadataValue(filteredSample, 'informante'),
              'beforeMatch': fragment.beforeWord,
              'match': fragment.word,
              'afterMatch': fragment.afterWord
          })))));
        });
    } else {
      this.sampleService.filterSamples(
        this.project, this.searchTerm, this.fieldsMap, this.filteredTags.map(value => value.id), true).pipe(
          flatMap((samples: Sample[]) =>
            forkJoin(samples.map(sample =>
              this.metadataValuesService.findByForA(sample).pipe(map(values => {
                sample.has = values;
                return sample;
              })))))
        ).subscribe((fullSamples: Sample[]) => {
          const exporter = new ExportToCsv(options);
          exporter.generateCsv([].concat(...fullSamples.map(fullSample => ({
            'id': this.findMetadataValue(fullSample, 'informante'),
            'text': fullSample.text
          }))));
        });
    }
  }

  findMetadataValue(sample: Sample, text: string) {
    const metadataValue = sample.has.find((mv: MetadataValue) => mv.fieldName.includes(text));
    return metadataValue ? metadataValue.value : null;
  }
}
