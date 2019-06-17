import {Injectable, Injector} from '@angular/core';
import {RestService} from 'angular4-hal-aot';
import {XMLSample} from '../../shared/models/XMLsample';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';

@Injectable()
export class XMLSampleService extends RestService<XMLSample> {

  constructor(injector: Injector, private http: HttpClient) {
    super(XMLSample, 'xmlSamples', injector);
  }

  public findByDefinesName(name: string): Observable<XMLSample[]> {
    const options: any = {params: [{key: 'name', value: name}]};
    return this.search('findByDefinesName', options);
  }
}
