import {Component, OnInit} from '@angular/core';
import {AuthenticationBasicService} from '../core/services/authentication-basic.service';
import {User} from '../shared/models/user';

@Component({
  selector: 'app-login-navbar,[app-login-navbar]',
  templateUrl: './login-navbar.component.html',
  styleUrls: [],
})
export class LoginNavbarComponent implements OnInit {

  constructor(private authenticationService: AuthenticationBasicService) {
  }

  ngOnInit() {
  }

  logout(): void {
    this.authenticationService.logout();
  }

  getCurrentUserName(): string {
    return this.authenticationService.getCurrentUser().id;
  }

  isLoggedIn(): boolean {
    return this.authenticationService.isLoggedIn();
  }

  getUser(): User {
    return this.authenticationService.getCurrentUser();
  }
}
