import {Injectable, Injector} from '@angular/core';
import {FilteredSample, Sample, TextFragment} from './sample';
import {RestService} from 'angular4-hal-aot';
import {Observable} from 'rxjs/internal/Observable';
import {map} from 'rxjs/operators';
import {SampleStatistics} from './sample-statistics';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';


@Injectable()
export class SampleService extends RestService<Sample> {
  constructor(injector: Injector,
              private http: HttpClient) {
    super(Sample, 'samples', injector);
  }

  public filterSamples(word: string, metadata: Object, tags: string[]): Observable<Sample[]> {
    const body: any = {word: word, metadata: metadata, tags: tags};
    return this.customQueryPost('/filter', null, body);
  }

  public getFilterStatistics(word: string, metadata: Object, tags: string[]): Observable<SampleStatistics> {
    const body: any = {word: word, metadata: metadata, tags: tags};
    return this.http.post(`${environment.API}/samples/filter/statistics`, body).pipe(
      map(value => new SampleStatistics(value))
    );
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
    const regex = new RegExp(`(\\b${searchTerm}\\b)`, 'gi');
    let match = regex.exec(text);
    while (match != null) {
      result.push(new TextFragment(text.substring(match.index < 60 ? 0 : text.indexOf(' ', match.index - 60) + 1, match.index),
        match[0], text.length - match.index - match[0].length < 60 ?
          text.substring(match.index + match[0].length) :
          text.substring(match.index + match[0].length, text.concat(' ').indexOf(' ', match.index + match[0].length + 55))));
      match = regex.exec(text);
    }
    return result;
  }
}
