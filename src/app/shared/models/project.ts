import { Resource } from 'angular4-hal-aot';
import { Injectable } from '@angular/core';

@Injectable()
export class Project extends Resource {
  id: number;
  name: string;
  uri: string;
}
