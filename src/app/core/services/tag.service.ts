import {TagHierarchy} from '../../shared/models/tag-hierarchy';
import {Injectable, Injector} from '@angular/core';
import {Tag} from '../../shared/models/tag';
import {RestService} from 'angular4-hal-aot';
import {Observable} from 'rxjs/internal/Observable';
import {TagsTree} from '../../shared/models/tags-tree';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Project} from '../../shared/models/project';

@Injectable()
export class TagService extends RestService<Tag> {
  constructor(injector: Injector,
              private http: HttpClient) {
    super(Tag, 'tags', injector);
  }

  public findByParent(parent: Tag): Observable<Tag> {
    const options: any = {params: [{key: 'parent', value: parent}]};
    return this.searchSingle('findByParent', options);
  }

  public findByNameContaining(name: string): Observable<Tag[]> {
    const options: any = {params: [{key: 'name', value: name}]};
    return this.search('findByNameContaining', options);
  }

 public findByTagHierarchy(tagHierarchy: TagHierarchy): Observable<Tag[]> {
    const options: any = {params: [{key: 'tagHierarchy', value: tagHierarchy.uri}]};
    return this.search('findByTagHierarchy', options);
  }

  public getTagHierarchyTree(project: Project): Observable<TagsTree> {
    return this.http.get<TagsTree>(
      environment.API + project.uri + '/tags'
    );
  }

  public createTagsTreeInASingleShot(body: any, project: Project): Observable<TagHierarchy> {
    return this.http.post<TagHierarchy>(
      environment.API + project.uri + '/tags',
      body
    );
  }
}
