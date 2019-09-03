import {Injectable, Injector} from '@angular/core';
import {RestService} from 'angular4-hal-aot';
import {Tag} from '../../shared/models/tag';
import {User} from '../../shared/models/user';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';
import {map} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService extends RestService<User> {

  constructor(
    injector: Injector,
    private http: HttpClient
  ) {
    super(User, 'users', injector);
  }

  getIdentity(): Observable<User> {
    return this.http.get(`${environment.API}/identity`).pipe(
      map(data => {
        const user: User = new User(data);
        return user;
      })
    );
  }

  changeEmail(user: User, newEmail: string): Observable<User> {
    return this.http.patch(`${environment.API}${user.uri}`, {'email': newEmail}).pipe(
      map(data => new User(data))
    );
  }
}
