import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FilteredSample, Sample} from '../sample';
import {SampleService} from '../sample.service';
import {map, startWith} from 'rxjs/operators';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {MetadataField} from '../../metadatafield/metadata-field';
import {MetadataFieldService} from '../../metadatafield/metadata-field.service';
import {Observable} from 'rxjs';
import {Tag} from '../../tag/tag';
import {TagService} from '../../tag/tag.service';


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

  public errorMessage: string;
  public searchTerm: string;
  public filterForm: FormGroup;
  public advancedFiltersActive: boolean;
  public metadataFields: MetadataField[];
  public filteredFields: Observable<MetadataField[]>[] = [];
  public tags: Tag[];
  public filteredTags: Observable<Tag[]>[] = [];

  constructor(private sampleService: SampleService,
              private metadataFieldService: MetadataFieldService,
              private tagService: TagService,
              private formBuilder: FormBuilder) {
  }

  ngOnInit(): void {
    this.filterForm = this.formBuilder.group({
      word: '',
      metadata: this.formBuilder.array([]),
      annotations: this.formBuilder.array([])
    });
  }

  filter() {
    this.searchTerm = this.filterForm.get('word').value;
    const metadata = {};
    this.filterForm.get('metadata').value.forEach(value => {
      if (value['field'] !== '' && value['value'] !== '') {
        metadata[value['field']] = value['value'];
      }
    });
    const tags = [];
    this.filterForm.get('annotations').value.forEach(value => {
      if (value['name'] !== '') {
        tags.push(value['name']);
      }
    });

    this.sampleService.filterSamples(this.searchTerm, metadata, tags).subscribe(
      (samples: FilteredSample[]) => {
        this.emitResults.emit(samples.map(value => <FilteredSample>value));
      });
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
  }

  removeMetadataField(i: number) {
    this.metadataForm.removeAt(i);
    this.filteredFields.splice(i, 1);
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

  activateAdvandedFilters() {
    this.advancedFiltersActive = !this.advancedFiltersActive;
    this.metadataFieldService.getAll().subscribe(value => {
      this.metadataFields = value;
      this.addMetadataForm();
    });
    this.tagService.getAll().subscribe(value => {
      this.tags = value;
      this.addAnnotationForm();
    });

  }

  private _filterMetadata(value: string): MetadataField[] {
    const filterValue = value.toLowerCase();

    return this.metadataFields.filter(field => field.name.toLowerCase().includes(filterValue));
  }

  private _filterTags(value: string): Tag[] {
    const filterValue = value.toLowerCase();

    return this.tags.filter(tag => tag.name.toLowerCase().includes(filterValue));

  }
}
