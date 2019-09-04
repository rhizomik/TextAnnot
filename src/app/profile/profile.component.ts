import { Component, OnInit } from '@angular/core';
import {AuthenticationBasicService} from '../core/services/authentication-basic.service';
import {User} from '../shared/models/user';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {MetadataFieldModalComponent} from '../metadatafield/metadatafield-modal/metadata-field-modal.component';
import {ChangeEmailModalComponent} from './change-email-modal/change-email-modal.component';
import {UserService} from '../core/services/user.service';
import {ChangePasswordModalComponent} from "./change-password-modal/change-password-modal.component";

@Component({
  selector: 'app-identity',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  user: User;

  constructor(
    private userService: UserService,
    private modalService: NgbModal,
  ) { }

  ngOnInit() {
    this.userService.getLoggedUser().subscribe(value => this.user = value);
  }

  changeEmail() {
    const modalRef = this.modalService.open(ChangeEmailModalComponent, {size: 'sm', centered: true});
    modalRef.componentInstance.inputUser = this.user;
  }

  changePassword() {
    const modalRef = this.modalService.open(ChangePasswordModalComponent, {size: 'sm', centered: true});
    modalRef.componentInstance.inputUser = this.user;
  }
}
