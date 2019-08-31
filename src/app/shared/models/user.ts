import {Authority} from '../../login-basic/authority';
import {Resource} from 'angular4-hal-aot';
import {Injectable} from '@angular/core';

@Injectable()
export class User extends Resource {
  id: string;
  uri: string;
  username = '';
  email: string;
  authorities: Authority[] = [];
  _links: any = {};
  authorization = '';
  password = '';

  constructor(values: Object = {}) {
    super();
    Object.assign(<any>this, values);
  }
}
