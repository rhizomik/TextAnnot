import { Resource } from 'angular4-hal-aot';
import {Project} from './project';

export class AnnotationStatus extends Resource {
  id: number;
  name: string;
  uri: string;
  definedAt: Project;
}
