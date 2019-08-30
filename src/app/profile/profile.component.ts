import { Component, OnInit } from '@angular/core';
import {AuthenticationBasicService} from '../core/services/authentication-basic.service';
import {User} from '../shared/models/user';

@Component({
  selector: 'app-identity',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  user: User;

  constructor(
    private authService: AuthenticationBasicService,
  ) { }

  ngOnInit() {
    this.authService.getIdentity().subscribe(value => this.user = value);
  }

}
