import { Resource} from 'angular4-hal-aot';
import { Injectable } from '@angular/core';

@Injectable()
export class XMLSample extends Resource {
  uri: string;
  text: string;
  xml: string;
}
