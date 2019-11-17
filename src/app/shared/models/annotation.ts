import { Linguist } from './linguist';
import { Resource } from 'angular4-hal-aot';
import { Sample } from './sample';
import { Tag } from './tag';
import { Injectable } from '@angular/core';

@Injectable()
export class Annotation extends Resource {
  id: number;
  start: number;
  end: number;
  reviewed: boolean;
  tag: Tag;
  sample: Sample;
  linguist: Linguist;

  constructor(sample?: Sample, start?: number, end?: number) {
    super();
    this.start = start;
    this.end = end;
    this.sample = sample;
  }
}
