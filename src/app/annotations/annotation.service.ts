import { Annotation } from './annotation';
import { HttpClient } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { RestService } from 'angular4-hal-aot';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from '../../environments/environment';
import { Sample } from '../sample/sample';

@Injectable()
export class AnnotationService extends RestService<Annotation> {
  constructor(injector: Injector, private http: HttpClient) {
    super(Annotation, 'annotations', injector);
  }

  public findBySample(sample: Sample): Observable<Annotation[]> {
    const options: any = {params: [{key: 'sample', value: sample.uri}]};
    return this.search('findBySample', options);
  }
}
