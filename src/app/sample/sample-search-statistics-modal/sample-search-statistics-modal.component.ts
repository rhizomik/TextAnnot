import {AfterViewInit, Component, Input, OnInit, ViewChild} from '@angular/core';
import {AuthenticationBasicService} from '../../login-basic/authentication-basic.service';
import {Router} from '@angular/router';
import {MetadataFieldService} from '../../core/services/metadata-field.service';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {SampleStatistics} from '../../shared/models/sample-statistics';

@Component({
  selector: 'app-sample-search-statistics-modal',
  templateUrl: './sample-search-statistics-modal.component.html',
  styleUrls: ['./sample-search-statistics-modal.component.css']
})
export class SampleSearchStatisticsModalComponent implements OnInit {
  Arr = Array;

  @Input()
  public statistics: SampleStatistics;

  @ViewChild('tree') tree;

  constructor(
    private authentication: AuthenticationBasicService,
    private router: Router,
    private metadataFieldService: MetadataFieldService,
    private activeModal: NgbActiveModal
  ) {
  }

  ngOnInit() {
  }

  navigateFieldValues(metadataFieldName: string) {
    this.metadataFieldService.getMetadataFieldsByName(metadataFieldName)
      .subscribe(value => {
        this.activeModal.dismiss();
        this.router.navigate(['metadataFields', value.id, 'values']);
      });
  }
}
