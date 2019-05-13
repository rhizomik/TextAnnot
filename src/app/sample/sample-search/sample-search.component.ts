import {Component, Input, EventEmitter, Output, OnInit} from '@angular/core';
import {FilteredSample, Sample, TextFragment} from '../sample';
import { SampleService} from '../sample.service';
import { MetadataTemplate } from '../../metadata-template/metadata-template';
import {map, startWith} from 'rxjs/operators';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {visitValue} from '@angular/compiler/src/util';
import {MetadataField} from "../../metadatafield/metadata-field";
import {MetadataFieldService} from "../../metadatafield/metadata-field.service";
import {Observable} from "rxjs";


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

  constructor(private sampleService: SampleService,
              private metadataFieldService: MetadataFieldService,
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
      if (value['field'] != '' && value['value'] != '')
        metadata[value['field']] = value['value'];
    });
    this.sampleService.filterSamples(this.searchTerm, metadata).subscribe(
      (samples: FilteredSample[]) => {
        this.emitResults.emit(samples.map(value => <FilteredSample>value));
      });
  }

  get metadataForm() {
    return this.filterForm.get('metadata') as FormArray
  }

  addMetadataForm() {
    this.metadataForm.push(this.formBuilder.group({
      field: '',
      value: '',
    }));

    this.filteredFields.push(this.metadataForm.at(this.metadataForm.length-1).get('field').valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
    ));
  }

  removeMetadataField(i: number) {
    this.metadataForm.removeAt(i);
  }

  activateAdvandedFilters() {
    this.advancedFiltersActive = !this.advancedFiltersActive;
    this.metadataFieldService.getAll().subscribe(value => {
      this.metadataFields = value;
      this.addMetadataForm();
    });
  }

  private _filter(value: string): MetadataField[] {
    const filterValue = value.toLowerCase();

    return this.metadataFields.filter(field => field.name.toLowerCase().includes(filterValue));
  }
}
