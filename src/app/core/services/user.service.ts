import {Injectable, Injector} from '@angular/core';
import {RestService} from 'angular4-hal-aot';
import {Tag} from '../../shared/models/tag';
import {User} from '../../shared/models/user';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';
import {map} from 'rxjs/operators';
import {HttpBackend, HttpClient, HttpHeaders} from '@angular/common/http';
import {AuthenticationBasicService} from "./authentication-basic.service";

@Injectable({
  providedIn: 'root'
})
export class UserService extends RestService<User> {

  httpNoAuth: HttpClient;

  constructor(
    injector: Injector,
    private http: HttpClient,
    private auth: AuthenticationBasicService,
    httpBackend: HttpBackend
  ) {
    super(User, 'users', injector);
    this.httpNoAuth = new HttpClient(httpBackend);
  }

  getLoggedUser(): Observable<User> {
    return this.http.get(`${environment.API}/identity`).pipe(
      map(data => {
        const user: User = new User(data);
        return user;
      })
    );
  }

  getIdentity(username: string, password: string): Observable<Object> {
    const httpOptions = {
      headers: new HttpHeaders({'authorization': this.auth.generateAuthorization(username, password)})
    };
    return this.httpNoAuth.get(`${environment.API}/identity`, httpOptions);
  }
  changePassword(user: User, newPassword: string): Observable<User> {
    return this.http.patch(`${environment.API}${user.uri}`, {'password': newPassword}).pipe(
      map(data => new User(data))
    );
  }

  changeEmail(user: User, newEmail: string): Observable<User> {
    return this.http.patch(`${environment.API}${user.uri}`, {'email': newEmail}).pipe(
      map(data => new User(data))
    );
  }

  resetPassword(user: User): Observable<User> {
    return this.http.patch(`${environment.API}${user.uri}`, {'resetPassword': true}).pipe(
      map(data => new User(data))
    );
  }
}
