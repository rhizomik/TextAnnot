import {AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {AuthenticationBasicService} from '../../login-basic/authentication-basic.service';
import {Router} from '@angular/router';
import {MetadataFieldService} from '../../core/services/metadata-field.service';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {MetadataStatistics, SampleStatistics} from '../../shared/models/sample-statistics';
import {ExportToCsv} from 'export-to-csv';

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

  @ViewChild('value') value: ElementRef;
  @ViewChild('globPerc') globPerc: ElementRef;

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

  downloadStatistics(fieldStatistics: MetadataStatistics) {
    const options = {
      fieldSeparator: ';',
      filename: 'export',
      quoteStrings: '"',
      decimalSeparator: '.',
      showLabels: true,
      showTitle: true,
      title: fieldStatistics.metadataField,
      useTextFile: false,
      useBom: true,
      useKeysAsHeaders: false,
      headers: [this.value.nativeElement.textContent, 'ni', '%', this.globPerc.nativeElement.textContent]
    };
    const exporter = new ExportToCsv(options);
    exporter.generateCsv(fieldStatistics.statistics);
  }
}
