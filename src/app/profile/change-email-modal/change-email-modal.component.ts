import {Component, Input, OnInit} from '@angular/core';
import {User} from '../../shared/models/user';
import {MetadataField} from '../../shared/models/metadata-field';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {UserService} from '../../core/services/user.service';

@Component({
  selector: 'app-change-email-modal',
  templateUrl: './change-email-modal.component.html',
  styleUrls: ['./change-email-modal.component.css']
})
export class ChangeEmailModalComponent implements OnInit {

  @Input()
  public inputUser: User;
  public user: User;

  public newEmail: string;
  public showAlert: boolean;
  public errMessage: string;

  constructor(
    private modal: NgbActiveModal,
    private userService: UserService
  ) { }

  ngOnInit() {
    console.log(this.inputUser);
  }

  onSubmit(): void {
    this.userService.changeEmail(this.inputUser, this.newEmail).subscribe(value => {
      this.inputUser.email = this.newEmail;
      this.modal.close();
    },
      error => {
        this.errMessage = 'Invalid email';
        this.showAlert = true;
        setTimeout(() => this.showAlert = false, 10000);
      });
  }

  closeModal() {
    this.modal.close();
  }

}
