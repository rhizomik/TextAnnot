import { Resource } from 'angular4-hal-aot';
import { Sample } from './sample';
import { MetadataField } from './metadata-field';

export class MetadataValue extends Resource {
  uri: string;
  id: string;
  value: string;
  fieldName: string;
  fieldCategory: string;
  forA: Sample;
  values: MetadataField;
}
