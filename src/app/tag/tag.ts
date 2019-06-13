import { Injectable } from '@angular/core';
import { Resource } from 'angular4-hal-aot';
import {TagHierarchy} from '../shared/modal/tag-hierarchy';
import {Project} from '../shared/modal/project';


@Injectable()
export class Tag extends Resource {
  id: number;
  name: string;
  parent: Tag;
  project: Project;
  uri: string;
}
