import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {Linguist} from '../../shared/models/linguist';
import {LinguistService} from '../../core/services/linguist.service';

@Component({
  selector: 'app-linguist-create',
  templateUrl: '../user-form/user-form.component.html'
})
export class LinguistCreateComponent implements OnInit {
  public user: Linguist;
  public errorMessage: string;
  public formTitle = 'Register Linguist';
  public formSubtitle = 'Register a new user with role linguist';

  constructor(private router: Router,
              private linguistService: LinguistService) {
  }

  ngOnInit() {
    this.user = new Linguist();
  }

  onSubmit(): void {
    this.linguistService.create(this.user)
      .subscribe(
        (linguist: Linguist) => this.router.navigate([linguist.uri]));
  }
}
