import { Injectable } from '@angular/core';
import { Resource } from 'angular4-hal-aot';

@Injectable()
export class Linguist extends Resource {
  uri: string;
  username: string;
  email: string;
  authorities = [];
  id: string;
  password: string;
}
