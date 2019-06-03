import { Resource} from 'angular4-hal-aot';
import { MetadataValue } from '../metadataValue/metadataValue';
import { MetadataTemplate } from '../metadata-template/metadata-template';


export class MetadataField extends Resource {
  id: string;
  uri: string;
  name: string;
  type: string;
  category: string;
  includeStatistics: boolean;
  definedAt: MetadataTemplate;
  has: MetadataValue[];
}
