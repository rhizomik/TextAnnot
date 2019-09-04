import {Component, Input, OnInit} from '@angular/core';
import {UserService} from '../../core/services/user.service';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {User} from '../../shared/models/user';
import {catchError, flatMap, map} from "rxjs/operators";
import {AuthenticationBasicService} from "../../core/services/authentication-basic.service";

@Component({
  selector: 'app-change-password-modal',
  templateUrl: './change-password-modal.component.html',
  styleUrls: ['./change-password-modal.component.css']
})
export class ChangePasswordModalComponent implements OnInit {

  public currentPassword: string;
  public newPassword: string;
  public repNewPassword: string;

  public showAlert = false;
  public errMessage: string;

  @Input() inputUser: User;

  constructor(
    private userService: UserService,
    private modal: NgbActiveModal,
    private auth: AuthenticationBasicService,
  ) { }

  ngOnInit() {
  }


  onSubmit(): void {
    if (this.newPassword !== this.repNewPassword) {
      this.showAlert = true;
      this.errMessage = 'New passwords does not match';
      setTimeout(() => this.showAlert = false, 10000);
      return;
    }

    this.userService.getIdentity(this.inputUser.username, this.currentPassword).pipe(
      flatMap(value => this.userService.changePassword(this.inputUser, this.newPassword)),
      flatMap(value => this.auth.login(this.inputUser.username, this.newPassword))
    ).subscribe(value => {
      this.closeModal();
    },
      error1 => {
        this.showAlert = true;
        this.errMessage = 'Incorrect current password';
        setTimeout(() => this.showAlert = false, 10000);
      });
  }

  closeModal() {
    this.modal.close();
  }
}
