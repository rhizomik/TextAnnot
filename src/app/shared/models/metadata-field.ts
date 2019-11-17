import { Resource} from 'angular4-hal-aot';
import { MetadataValue } from './metadataValue';
import {Project} from './project';
import { Injectable } from '@angular/core';

@Injectable()
export class MetadataField extends Resource {
  id: string;
  uri: string;
  name: string;
  xmlName: string;
  type: string;
  category: string;
  includeStatistics: boolean;
  privateField: boolean;
  definedAt: Project;
  has: MetadataValue[];
}
