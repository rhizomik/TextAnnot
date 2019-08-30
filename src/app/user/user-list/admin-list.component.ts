import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {AdminService} from '../../core/services/admin.service';
import {Admin} from '../../shared/models/admin';

@Component({
  selector: 'app-admin-list',
  templateUrl: './admin-list.component.html'
})
export class AdminListComponent implements OnInit {
  public admins: Admin[] = [];
  public totalAdmins = 0;
  public errorMessage = '';

  @ViewChild('confirmDelete') confirmDeleteSpan: ElementRef;

  constructor(private adminService: AdminService) {
  }

  ngOnInit() {
    this.adminService.getAllAdmins()
      .subscribe(
        (admins: Admin[]) => {
          this.admins = admins;
          this.totalAdmins = admins.length;
        });
  }

  showSearchResults(admins) {
    this.admins = admins;
  }

  deleteAdmin(admin: Admin) {
    if (confirm(this.confirmDeleteSpan.nativeElement.textContent)) {
      this.adminService.deleteAdmin(admin).subscribe(value => {
        this.admins = this.admins.filter(value1 => value1.username !== admin.username);
        this.totalAdmins -= 1;
      });
    }
  }
}
