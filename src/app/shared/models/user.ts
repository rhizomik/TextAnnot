import {Authority} from '../../login-basic/authority';

export class User {
  id: string;
  uri: string;
  username = '';
  email: string;
  authorities: Authority[] = [];
  _links: any = {};
  authorization = '';
  password = '';

  constructor(values: Object = {}) {
    Object.assign(<any>this, values);
  }
}
