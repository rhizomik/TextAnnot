import {Injectable, Injector} from '@angular/core';
import {MetadataField} from './metadata-field';
import { RestService } from 'angular4-hal-aot';
import { Observable } from 'rxjs/internal/Observable';
import {MetadatafieldValueCounts} from './metadatafield-value-counts';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {environment} from '../../environments/environment';

@Injectable()
export class MetadataFieldService extends RestService<MetadataField> {

  constructor(injector: Injector,
              private http: HttpClient) {
    super(MetadataField, 'metadataFields', injector);
  }

  public getMetadataFieldsByUsername(text: string): Observable<MetadataField[]> {
    const options: any = {params: [{key: 'name', value: text}]};
    return this.search('findByMetadataFieldContaining', options);
  }

  public getMetadataFieldsByMetadataTemplate(metadataTemplate: string): Observable<MetadataField[]> {
    const options: any = {params: [{key: 'metadataTemplate', value: metadataTemplate}]};
    return this.search('findByDefinedAt', options);
  }

  public getMetadataFieldValuesCount(metadataFieldId: string): Observable<MetadatafieldValueCounts> {
    return this.http.get(`${environment.API}/metadataFields/${metadataFieldId}/value-counts`).pipe(
      map(value =>  new MetadatafieldValueCounts(value))
    );
  }

  public renameMetadataFieldValues(metadataFieldId: string, valueChanges: [string, string][]): Observable<Object> {
    return this.http.post(`${environment.API}/metadataFields/${metadataFieldId}/values-edit`, {renames: valueChanges});
  }
}
