import { Router } from '@angular/router';
import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {LinguistService} from '../../core/services/linguist.service';
import {Linguist} from '../../shared/models/linguist';
import {Admin} from '../../shared/models/admin';
import {UserService} from '../../core/services/user.service';

@Component({
  selector: 'app-linguist-list',
  templateUrl: './linguist-list.component.html'
})
export class LinguistListComponent implements OnInit {
  public linguists: Linguist[] = [];
  public totalLinguists = 0;
  public errorMessage = '';

  @ViewChild('confirmDelete') confirmDeleteSpan: ElementRef;
  @ViewChild('confirmResetPassword') resetPasswordSpan: ElementRef;

  constructor(
    public router: Router,
    private linguistService: LinguistService,
    private userService: UserService) {
  }

  ngOnInit() {
    this.linguistService.getAll()
      .subscribe(
        (linguists: Linguist[]) => {
          this.linguists = linguists;
          this.totalLinguists = linguists.length;
        });
  }

  showSearchResults(linguists) {
    this.linguists = linguists;
  }

  deleteLinguist(linguist: Linguist) {
    if (confirm(this.confirmDeleteSpan.nativeElement.textContent)) {
      this.linguistService.delete(linguist).subscribe(value => {
        this.linguists = this.linguists.filter(l => l.username !== linguist.username);
        this.totalLinguists -= 1;
      });
    }
  }

  resetPassword(linguist: Linguist) {
    if (confirm(this.resetPasswordSpan.nativeElement.textContent)) {
      this.userService.resetPassword(linguist).subscribe(value => alert('Password reseted'));
    }
  }
}
