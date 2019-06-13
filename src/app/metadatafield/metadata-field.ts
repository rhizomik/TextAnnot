import { Resource} from 'angular4-hal-aot';
import { MetadataValue } from '../metadataValue/metadataValue';
import {Project} from '../shared/modal/project';


export class MetadataField extends Resource {
  id: string;
  uri: string;
  name: string;
  type: string;
  category: string;
  includeStatistics: boolean;
  definedAt: Project;
  has: MetadataValue[];
}
