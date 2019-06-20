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
  public tags: Tag[];
  public filteredTags: Observable<Tag[]>[] = [];
  private project: Project;
  public metadataValues: string[][] = [];

  constructor(private sampleService: SampleService,
              private metadataFieldService: MetadataFieldService,
              private tagService: TagService,
              private formBuilder: FormBuilder,
              private projectService: ProjectService,
              private metadataValuesService: MetadataValueService) {
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
    this.tagService.getAll().subscribe(value => {
      this.tags = value;
      this.addAnnotationForm();
    });
  }

  filter() {
    this.searchTerm = this.filterForm.get('word').value;
    const metadata: [string, string][] = new Array<[string, string]>();
    this.filterForm.get('metadata').value.forEach(value => {
      if (value['field'] !== '' && value['value'] !== '') {
        metadata.push([value['field'], value['value']]);
      }
    });
    const tags = [];
    this.filterForm.get('annotations').value.forEach(value => {
      if (value['name'] !== '') {
        tags.push(value['name']);
      }
    });

    this.sampleService.filterSamplesByWord(this.searchTerm, metadata, tags).subscribe(
      (samples: Sample[]) => {
        this.emitResults.emit(samples);
      });

    this.sampleService.getFilterStatistics(this.searchTerm, metadata, tags).subscribe(
      (value: SampleStatistics) => this.emitStatistics.emit(value)
    );
  }

  get metadataForm() {
    return this.filterForm.get('metadata') as FormArray;
  }

  get annotationsForm() {
    return this.filterForm.get('annotations') as FormArray;
  }

  addMetadataForm() {
    this.metadataForm.push(this.formBuilder.group({
      field: '',
      value: '',
    }));

    this.filteredFields.push(this.metadataForm.at(this.metadataForm.length - 1).get('field').valueChanges.pipe(
      startWith(''),
      map(value => this._filterMetadata(value))
    ));

    this.metadataValues.push([]);
  }

  removeMetadataField(i: number) {
    this.metadataForm.removeAt(i);
    this.filteredFields.splice(i, 1);
    this.metadataValues.splice(i, 1);
  }

  addAnnotationForm() {
    this.annotationsForm.push(this.formBuilder.group({name: ''}));

    this.filteredTags.push(this.annotationsForm.at(this.annotationsForm.length - 1).get('name').valueChanges.pipe(
      startWith(''),
      map(value => this._filterTags(value))
    ));
  }

  removeAnnotationForm(i: number) {
    this.annotationsForm.removeAt(i);
    this.filteredTags.splice(i, 1);
  }

  private _filterMetadata(value: string): MetadataField[] {
    const filterValue = value.toLowerCase();

    return this.metadataFields.filter(field => field.name.toLowerCase().includes(filterValue));
  }

  private _filterTags(value: string): Tag[] {
    const filterValue = value.toLowerCase();

    return this.tags.filter(tag => tag.name.toLowerCase().includes(filterValue));

  }

  getMetadataValues(name: string, i: number) {
    this.metadataValuesService.findDistinctValuesByFieldName(name).subscribe(
      value => this.metadataValues[i] = value.values ? value.values : []
    );
  }

  filterValues(metadataValue: string[], value: string): string[] {
    return metadataValue.filter(v => v.includes(value));
  }
}
