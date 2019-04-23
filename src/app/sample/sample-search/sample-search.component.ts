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
  constructor(private sampleService: SampleService) {
  }

  performSearch(searchTerm: string): void {
    this.sampleService.findByTextContainingWord(searchTerm).pipe(
      map(samples => {
        return samples.map(value => {
          const filteredSample = <FilteredSample>value;
          filteredSample.searchText = searchTerm;
          filteredSample.textFragments = this.getTextFragments(searchTerm, filteredSample.text);
          filteredSample.text = filteredSample.text.replace(new RegExp(`\\b${searchTerm}\\b`, 'gi'), `<b>${searchTerm}</b>`);
          return filteredSample;
        });
      })).subscribe(
      (samples: FilteredSample[]) => {
        this.emitResults.emit(samples.map(value => <FilteredSample>value));
      });
  }

  private getTextFragments(searchTerm: string, text: string): TextFragment[] {
    let startIndex = 0;
    const result = [];
    while (text.includes(searchTerm, startIndex)) {
      const termPosition = text.indexOf(searchTerm, startIndex);
      const textFragment = new TextFragment(text.substring(text.indexOf(' ', termPosition - 60), termPosition),
                                          searchTerm,
                                          text.substring(termPosition + searchTerm.length,
                                            text.indexOf(' ', termPosition + 55) !== -1 ?
                                              text.indexOf(' ', termPosition + 55) : text.length));
      result.push(textFragment);
      startIndex = termPosition + searchTerm.length;
    }
    return result;
  }
}
