import { Resource } from 'angular4-hal-aot';
import { Project } from './project';
import { Injectable } from '@angular/core';

@Injectable()
export class AnnotationStatus extends Resource {
  id: number;
  name: string;
  uri: string;
  definedAt: Project;
}
