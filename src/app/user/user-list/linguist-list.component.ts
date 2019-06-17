import { Router } from '@angular/router';
import {Component, OnInit} from '@angular/core';
import {LinguistService} from '../../core/services/linguist.service';
import {Linguist} from '../../shared/models/linguist';

@Component({
  selector: 'app-linguist-list',
  templateUrl: './linguist-list.component.html'
})
export class LinguistListComponent implements OnInit {
  public linguists: Linguist[] = [];
  public totalLinguists = 0;
  public errorMessage = '';

  constructor(
    public router: Router,
    private linguistService: LinguistService) {
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
}
