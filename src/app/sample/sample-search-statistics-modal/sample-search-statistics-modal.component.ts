import {Component, Input, OnInit} from '@angular/core';
import {SampleStatistics} from '../sample-statistics';
import {AuthenticationBasicService} from "../../login-basic/authentication-basic.service";
import {Router} from "@angular/router";
import {MetadataFieldService} from "../../metadatafield/metadata-field.service";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-sample-search-statistics-modal',
  templateUrl: './sample-search-statistics-modal.component.html',
  styleUrls: ['./sample-search-statistics-modal.component.css']
})
export class SampleSearchStatisticsModalComponent implements OnInit {

  @Input()
  public statistics: SampleStatistics;

  constructor(
    private authentication: AuthenticationBasicService,
    private router: Router,
    private metadataFieldService: MetadataFieldService,
    private activeModal: NgbActiveModal
  ) { }

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
