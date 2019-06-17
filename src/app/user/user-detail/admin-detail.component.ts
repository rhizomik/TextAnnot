import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AdminService} from '../../core/services/admin.service';
import {Admin} from '../../shared/models/admin';
import { ModalService } from './../../shared/confirm-modal/modal.service';
import { ConfirmModalComponent } from './../../shared/confirm-modal/confirm-modal.component';

@Component({
  selector: 'app-admin-detail',
  templateUrl: './user-detail.component.html'
})
export class AdminDetailComponent implements OnInit {
  public user: Admin = new Admin();
  public errorMessage: string;
  public detailsPageTitle = 'Administrator';
  public detailsPageSubtitle = 'Details about a registered user with role administrator';

  constructor(private route: ActivatedRoute,
              private adminService: AdminService,
              private confirmService: ModalService,
              private router: Router) {
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    this.adminService.getAdmin(id).subscribe(
      linguist => this.user = linguist);
  }

  public delete() {
    this.confirmService.init(ConfirmModalComponent, {
      title: 'Delete admin',
      message: 'Delete admin?'
    }).subscribe(
      deleted => {
        if (deleted) {
          this.adminService.deleteAdmin(this.user).subscribe(
            () => this.router.navigate(['admins']));
        }
      }
    );
  }
}
