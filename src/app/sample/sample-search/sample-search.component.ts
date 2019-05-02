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
          filteredSample.text = filteredSample.text.replace(new RegExp(`\\b${searchTerm}\\b`, 'gi'), `<b>$&</b>`);
          return filteredSample;
        });
      })).subscribe(
      (samples: FilteredSample[]) => {
        this.emitResults.emit(samples.map(value => <FilteredSample>value));
      });
  }

  private getTextFragments(searchTerm: string, text: string): TextFragment[] {
    const result = [];
    // const regex = new RegExp(`(?<=(.{60}))(\\b${searchTerm}\\b)(?=(.{0,60}))`, 'gi'); awaiting for lookbehind firefox support
    // const auxText = `${'.'.repeat(59)} ${text}`;
    const regex = new RegExp(`(\\b${searchTerm}\\b)(?=(.{0,60}))`, 'gi');
    let match = regex.exec(text);
    while (match != null) {
      const index = text.indexOf(match[2]) - searchTerm.length;
      result.push(new TextFragment(text.substring(text.indexOf(' ', index - 60), index),
        match[1], match[2].length < 60 ? match[2] : match[2].substring(0, match[2].lastIndexOf(' '))));
      match = regex.exec(text);
    }
    return result;
  }
}
