import {Injectable, Injector} from '@angular/core';
import {MetadataValue} from '../../shared/models/metadataValue';
import {RestService} from 'angular4-hal-aot';
import { Observable } from 'rxjs/internal/Observable';
import {Sample} from '../../shared/models/sample';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {MetadataDistinctValues} from '../../shared/aux-models/metadata-distinct-values';

@Injectable()
export class MetadataValueService extends RestService<MetadataValue> {

  constructor(injector: Injector,
              private http: HttpClient) {
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

  public findDistinctValuesByFieldName(name: string) {
    return this.http.get<MetadataDistinctValues>(`${environment.API}/metadataValues/search/findDistinctByField`, {params: {name: name}});
  }
}
