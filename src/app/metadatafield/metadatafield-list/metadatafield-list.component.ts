import {Component, OnInit} from '@angular/core';
import {MetadataField} from '../../shared/models/metadata-field';
import {MetadataFieldService} from '../../core/services/metadata-field.service';
import {PageEvent} from '@angular/material';

@Component({
  selector: 'app-metadatafield-list',
  templateUrl: './metadatafield-list.component.html',
  styleUrls: ['./metadatafield-list.component.css']
})
export class MetadataFieldListComponent implements OnInit {
  public metadataFields: MetadataField[] = [];
  public totalMetadataFields = 0;
  public pageTotalMetadataFields = 0;
  public errorMessage = '';
  public hasNext: Boolean;
  public actualPage: number;

  constructor(private metadatafieldService: MetadataFieldService) {
  }

  ngOnInit() {
    if (this.actualPage == null) {
      this.actualPage = 0;
    }

    this.metadatafieldService.getAll({size: 20})
      .subscribe((metadataFields: MetadataField[]) => {
        this.totalMetadataFields = this.metadatafieldService.totalElement();
        this.metadataFields = metadataFields;
      });
  }

  showSearchResults(metadataFields) {
    this.metadataFields = metadataFields;
  }

  handlePagination($event: PageEvent) {
    this.actualPage = $event.pageIndex;
    this.metadatafieldService.page(this.actualPage)
      .subscribe(
        (metadataFields: MetadataField[]) => {
          this.metadataFields = metadataFields;
        });
  }
}
