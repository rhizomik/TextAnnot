import {Injectable, Injector} from '@angular/core';
import {FilteredSample, Sample, TextFragment} from './sample';
import {HalParam, RestService} from 'angular4-hal-aot';
import {Observable} from 'rxjs/internal/Observable';
import {map} from 'rxjs/operators';
import {SampleStatistics} from './sample-statistics';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from '../../environments/environment';


@Injectable()
export class SampleService extends RestService<Sample> {
  constructor(injector: Injector,
              private http: HttpClient) {
    super(Sample, 'samples', injector);
  }

  public filterSamples(word: string, metadata: [string, string][], tags: string[]): Observable<Sample[]> {
    const params: HalParam[] = [];
    const filterParams = this.getFilterParamsObject(word, metadata, tags);
    params.push({key: 'size', value: 20});
    for (const key in filterParams) {
      params.push({key: key, value: filterParams[key]});
    }
    return this.customQuery('/filter', {params: params});
  }

  public getFilterStatistics(word: string, metadata: [string, string][], tags: string[]): Observable<SampleStatistics> {
    return this.http.get(`${environment.API}/samples/filter/statistics`, {params: this.getFilterParamsObject(word, metadata, tags)}).pipe(
      map(value => new SampleStatistics(value))
    );
  }

  private getFilterParamsObject(word: string, metadata: [string, string][], tags: string[]): {[param: string]: string} {
    const params: {[param: string]: string} = {};
    params['word'] = word;
    params['tags'] = tags.join(',');
    metadata.forEach(([field, value]) => {
      params[field] = value;
    });
    return params;
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
