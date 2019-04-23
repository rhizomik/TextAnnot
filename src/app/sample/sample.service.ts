import {Injectable, Injector} from '@angular/core';
import {Sample} from './sample';
import {RestService} from 'angular4-hal-aot';
import {Observable} from 'rxjs/internal/Observable';


@Injectable()
export class SampleService extends RestService<Sample> {
  constructor(injector: Injector) {
    super(Sample, 'samples', injector);
  }

  public findByTextContainingWord(word: string): Observable<Sample[]> {
    const options: any = {params: [{key: 'word', value: word}]};
    return this.search('findByTextContainingWord', options);
  }
}
