import { Injectable } from '@angular/core';
import { Resource } from 'angular4-hal-aot';
import {TagHierarchy} from './tag-hierarchy';
import {Project} from './project';


@Injectable()
export class Tag extends Resource {
  id: number;
  name: string;
  parent: Tag;
  project: Project;
  uri: string;
}
