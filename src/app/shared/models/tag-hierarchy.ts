import { Resource } from 'angular4-hal-aot';
import { Injectable } from '@angular/core';

@Injectable()
export class TagHierarchy extends Resource {
  id: number;
  name: string;
  uri: string;
}
