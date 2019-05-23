import {Injectable, Injector} from '@angular/core';
import {MetadataValue} from './metadataValue';
import {RestService} from 'angular4-hal-aot';
import { Observable } from 'rxjs/internal/Observable';
import {Sample} from '../sample/sample';

@Injectable()
export class MetadataValueService extends RestService<MetadataValue> {

  constructor(injector: Injector) {
    super(MetadataValue, 'metadataValues', injector);
  }

  public getMetadataValuesByUsername(text: string): Observable<MetadataValue[]> {
    const options: any = {params: [{key: 'value', value: text}]};
    return this.search('findByValueContaining', options);
  }

  public findByForA(sample: Sample): Observable<MetadataValue[]> {
    const options: any = {params: [{key: 'sample', value: sample.uri}]};
    return this.search('findByForA', options);
  }
}
