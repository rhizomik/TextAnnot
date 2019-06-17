import { ModalService } from './../../shared/confirm-modal/modal.service';
import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {LinguistService} from '../../core/services/linguist.service';
import {Linguist} from '../../shared/models/linguist';
import { ConfirmModalComponent } from './../../shared/confirm-modal/confirm-modal.component';

@Component({
  selector: 'app-linguist-detail',
  templateUrl: './user-detail.component.html'
})
export class LinguistDetailComponent implements OnInit {
  public user: Linguist = new Linguist();
  public errorMessage: string;
  public detailsPageTitle = 'Linguist';
  public detailsPageSubtitle = 'Details about a registered user with role linguist';

  constructor(private route: ActivatedRoute,
              private linguistService: LinguistService,
              private confirmService: ModalService,
              private router: Router) {
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    this.linguistService.get(id).subscribe(
      linguist => this.user = linguist);
  }

  public delete() {
    this.confirmService.init(ConfirmModalComponent, {
      title: 'Delete linguist',
      message: 'Delete linguist?'
    }).subscribe(
      deleted => {
        if (deleted) {
          this.linguistService.delete(this.user).subscribe(
            () => this.router.navigate(['linguists']));
        }
      }
    );
  }
}
