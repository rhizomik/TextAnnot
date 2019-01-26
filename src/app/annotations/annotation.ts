import { Linguist } from './../user/linguist';
import { Resource } from 'angular4-hal-aot';
import { Sample } from '../sample/sample';
import { Tag } from '../tag/tag';

export class Annotation extends Resource {
  id: number;
  start: number;
  end: number;
  reviewed: boolean;
  tag: Tag;
  sample: Sample;
  linguist: Linguist;
}
