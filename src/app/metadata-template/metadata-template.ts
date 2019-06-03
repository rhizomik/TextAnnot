
import { Injectable } from '@angular/core';
import { Resource } from 'angular4-hal-aot';
import { Sample } from '../sample/sample';

@Injectable()
export class MetadataTemplate extends Resource {
  id: string;
  name: string;
  defines: [{}];
  describes: Sample[];
  uri: string;
}
