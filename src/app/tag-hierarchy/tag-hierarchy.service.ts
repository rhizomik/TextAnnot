import { HttpClient } from '@angular/common/http';
import {Injectable, Injector} from '@angular/core';
import {TagHierarchy} from '../tag-hierarchy/tag-hierarchy';
import {RestService} from 'angular4-hal-aot';
import {Observable} from 'rxjs/internal/Observable';
import { environment } from '../../environments/environment';
import { TagHierarchyTree } from './tag-hierarchy-tree';

@Injectable()
export class TagHierarchyService extends RestService<TagHierarchy> {
  constructor(injector: Injector, private http: HttpClient) {
    super(TagHierarchy, 'tagHierarchies', injector);
  }

  public findByName(name: string): Observable<TagHierarchy> {
    const options: any = {params: [{key: 'name', value: name}]};
    return this.searchSingle('findByName', options);
  }

  public findByNameContaining(name: string): Observable<TagHierarchy[]> {
    const options: any = {params: [{key: 'name', value: name}]};
    return this.search('findByNameContaining', options);
  }

  public getTagHierarchyTree(tagHierarchy: TagHierarchy): Observable<TagHierarchyTree> {
    return this.http.get<TagHierarchyTree>(
      environment.API + tagHierarchy.uri + '/tags'
    );
  }

  public createTagHierarchyInASingleShot(body: any): Observable<TagHierarchy> {
    return this.http.post<TagHierarchy>(
      environment.API + '/quickTagHierarchyCreate',
      body
    );
  }
}
