import { Resource } from 'angular4-hal-aot';

export class Project extends Resource {
  id: number;
  name: string;
  uri: string;
}
