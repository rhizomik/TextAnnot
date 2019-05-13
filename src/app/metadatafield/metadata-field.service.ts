import {Injectable, Injector} from '@angular/core';
import {MetadataField} from './metadata-field';
import { RestService } from 'angular4-hal-aot';
import { Observable } from 'rxjs/internal/Observable';

@Injectable()
export class MetadataFieldService extends RestService<MetadataField> {

  constructor(injector: Injector) {
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
}
