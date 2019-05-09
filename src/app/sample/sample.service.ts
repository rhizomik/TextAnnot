import {Injectable, Injector} from '@angular/core';
import {FilteredSample, Sample, TextFragment} from './sample';
import {RestService} from 'angular4-hal-aot';
import {Observable} from 'rxjs/internal/Observable';
import {map} from 'rxjs/operators';


@Injectable()
export class SampleService extends RestService<Sample> {
  constructor(injector: Injector) {
    super(Sample, 'samples', injector);
  }

  public filterSamples(word: string, metadata: Object): Observable<Sample[]> {
    const body: any = {word: word, metadata: metadata};
    return this.customQueryPost('/filter', null, body);
  }

  public convertToFilteredSamples(samples: Sample[], searchTerm: string): FilteredSample[] {
    return samples.map(sample => {
        const filteredSample = <FilteredSample>sample;
        filteredSample.searchText = searchTerm;
        filteredSample.textFragments = this.getTextFragments(searchTerm, filteredSample.text);
        filteredSample.text = filteredSample.text.replace(new RegExp(`\\b${searchTerm}\\b`, 'gi'), `<b>$&</b>`);
        return filteredSample;
      });
  }

  private getTextFragments(searchTerm: string, text: string): TextFragment[] {
    const result = [];
    // const regex = new RegExp(`(?<=(.{60}))(\\b${searchTerm}\\b)(?=(.{0,60}))`, 'gi'); awaiting for lookbehind firefox support
    // const auxText = `${'.'.repeat(59)} ${text}`;
    const regex = new RegExp(`(.*)(\\b${searchTerm}\\b)(?=(.{0,60}))`, 'gi');
    let match = regex.exec(text);
    while (match != null) {
      result.push(new TextFragment(text.substring(match[1].length < 60 ? 0 : text.indexOf(' ', match[1].length - 60) + 1, match[1].length),
        match[2], match[3].length < 60 ? match[3] : match[3].substring(0, match[3].lastIndexOf(' '))));
      match = regex.exec(text);
    }
    return result;
  }
}
