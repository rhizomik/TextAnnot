import { Component, Input, EventEmitter, Output } from '@angular/core';
import {FilteredSample, Sample, TextFragment} from '../sample';
import { SampleService} from '../sample.service';
import { MetadataTemplate } from '../../metadata-template/metadata-template';
import {map} from 'rxjs/operators';


@Component({
  selector: 'app-sample-search',
  templateUrl: './sample-search.component.html',
  styleUrls: ['./sample-search.component.css']
})
export class SampleSearchComponent {
  @Input()
  samples: Sample[];
  @Output()
  emitResults: EventEmitter<any> = new EventEmitter();

  public errorMessage: string;
  public searchTerm: string;
  constructor(private sampleService: SampleService) {
  }

  performSearch(searchTerm: string): void {
    this.searchTerm = searchTerm;
    this.sampleService.findByTextContainingWord(searchTerm).subscribe(
      (samples: FilteredSample[]) => {
        this.emitResults.emit(samples.map(value => <FilteredSample>value));
      });
  }
}
