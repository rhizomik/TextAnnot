import { Linguist } from './linguist';
import { Resource } from 'angular4-hal-aot';
import { Sample } from './sample';
import { Tag } from './tag';

export class Annotation extends Resource {
  id: number;
  start: number;
  end: number;
  reviewed: boolean;
  tag: Tag;
  sample: Sample;
  linguist: Linguist;
}
