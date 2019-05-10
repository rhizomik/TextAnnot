import {Component, Input, EventEmitter, Output, OnInit} from '@angular/core';
import {FilteredSample, Sample, TextFragment} from '../sample';
import { SampleService} from '../sample.service';
import { MetadataTemplate } from '../../metadata-template/metadata-template';
import {map} from 'rxjs/operators';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {visitValue} from '@angular/compiler/src/util';


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

  constructor(private sampleService: SampleService,
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
    this.filterForm.get('metadata').value.forEach(value => metadata[value['field']] = value['value']);
    this.sampleService.filterSamples(this.searchTerm, metadata).subscribe(
      (samples: FilteredSample[]) => {
        this.emitResults.emit(samples.map(value => <FilteredSample>value));
      });
  }

  get metadataForm() {
    return this.filterForm.get('metadata') as FormArray
  }

  addMetadataForm(index: number) {
    if (!this.advancedFiltersActive) {
      this.advancedFiltersActive = true;
    }

    this.metadataForm.push(this.formBuilder.group({
      field: '',
      value: '',
    }));
  }

  removeMetadataField(i: number) {
    this.metadataForm.removeAt(i);
  }

  trackByFn(index, item) {
    return index;
  }
}
