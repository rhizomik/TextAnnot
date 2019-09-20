import {Injectable, Injector} from '@angular/core';
import {FilteredSample, Sample, TextFragment} from '../../shared/models/sample';
import {HalParam, RestService} from 'angular4-hal-aot';
import {Observable} from 'rxjs/internal/Observable';
import {map} from 'rxjs/operators';
import {SampleStatistics} from '../../shared/models/sample-statistics';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {Project} from '../../shared/models/project';
import {AnnotationService} from './annotation.service';
import {Annotation} from '../../shared/models/annotation';


@Injectable()
export class SampleService extends RestService<Sample> {
  constructor(injector: Injector,
              private http: HttpClient,
              private annotationService: AnnotationService) {
    super(Sample, 'samples', injector);
  }

  public getSamplesByProject(project: Project) {
    const options: any = {params: [{key: 'project', value: project.uri}, {key: 'size', value: '20'}]};
    return this.search('findByProject', options);
}

  public findByProjectAndNotAnnotated(project: Project) {
    const options: any = {params: [{key: 'project', value: project.uri}, {key: 'size', value: '20'}]};
    return this.search('findByProjectAndNotAnnotated', options);
  }

  public filterSamples(project: Project, word: string, metadata: Map<string, string>,
                       tags: number[], allSamples = false): Observable<Sample[]> {
    const params: HalParam[] = [];
    const filterParams = this.getFilterParamsObject(project, word, metadata, tags);
    if (!allSamples) {
      params.push({key: 'size', value: 20});
    }
    for (const key in filterParams) {
      params.push({key: key, value: filterParams[key]});
    }
    return this.customQuery('/filter', {params: params});
  }

  public getGlobalStatistics(project: Project) {
    return this.getFilterStatistics(project, '', new Map<string, string>(), []);
  }

  public getFilterStatistics(project: Project, word: string, metadata: Map<string, string>, tags: number[]): Observable<SampleStatistics> {
    return this.http.get(`${environment.API}/samples/filter/statistics`,
      {params: this.getFilterParamsObject(project, word, metadata, tags)})
      .pipe(
      map(value => new SampleStatistics(value))
    );
  }

  public getTotalWords(project: Project): Observable<number> {
    const options: any = {params: [{key: 'project', value: project.uri}]};
    return this.http.get<number>(`${environment.API}/samples/search/getTotalWordsCount`,
      {params: {project: project.uri}});
  }

  private getFilterParamsObject(project: Project, word: string, metadata: Map<string, string>, tags: number[]): {[param: string]: string} {
    const params: {[param: string]: string} = {};
    params['projectId'] = String(project.id);
    params['word'] = word;
    params['tags'] = tags.join(',');
    metadata.forEach((value, field) => {
      if (value !== '') {
        params[field] = value;
      }
    });
    return params;
  }

  public convertToFilteredSamples(samples: Sample[], searchTerm: string, tags: number[]): Promise<FilteredSample[]> {
    return Promise.all(samples.map(async sample => {
      const filteredSample = <FilteredSample>sample;
      filteredSample.searchText = searchTerm;
      if (tags.length === 0) {
        filteredSample.textFragments = this.getTextFragmentsByWord(searchTerm, filteredSample.text);
      } else {
        filteredSample.textFragments = await this.getTextFragmentsByTags(sample, searchTerm, tags);
      }
      this.markSearchTerms(filteredSample);
      return filteredSample;
    }));
  }

  private markSearchTerms(filteredSample: FilteredSample) {
    const regex = new RegExp(`\\b${filteredSample.searchText.replace('*', '[A-Za-zÀ-ÖØ-öø-ÿ]*')}\\b`, 'gi');

    filteredSample.text = filteredSample.text.replace(regex, `<b>$&</b>`);
    filteredSample.htmlTextFragments = [];
    filteredSample.textFragments.forEach(value => {
      filteredSample.htmlTextFragments.push(new TextFragment(value.beforeWord.replace(regex, `<b>$&</b>`),
                                                             value.word.replace(regex, `<b>$&</b>`),
                                                             value.afterWord.replace(regex, `<b>$&</b>`)));
    });
  }

  private getTextFragmentsByWord(searchTerm: string, text: string): TextFragment[] {
    const result = [];
    // const regex = new RegExp(`(?<=(.{60}))(\\b${searchTerm}\\b)(?=(.{0,60}))`, 'gi'); awaiting for lookbehind firefox support
    // const auxText = `${'.'.repeat(59)} ${text}`;
    const regex = new RegExp(`(\\b${searchTerm.replace('*', '[A-Za-zÀ-ÖØ-öø-ÿ]*')}\\b)`, 'gi');
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

  private getTextFragmentsByTags(sample: Sample, searchTerm: string, tags: number[]): Promise<TextFragment[]> {
    return this.annotationService.findDistinctBySampleAndTags(sample, tags).pipe(
      map((annots: Annotation[]) => {
        return annots.map(value => new TextFragment(
          sample.text.substring(value.start < 60 ? 0 : sample.text.indexOf(' ', value.start - 60) + 1, value.start),
          sample.text.substring(value.start, value.end), sample.text.length - value.end < 60 ?
            sample.text.substring(value.end) :
            sample.text.substring(value.end,
          sample.text.concat(' ').indexOf(' ', value.end + 55))));
        }
      )

    ).toPromise();
  }
}
