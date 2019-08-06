import {Component, OnInit} from '@angular/core';
import {MetadataField} from '../../shared/models/metadata-field';
import {MetadataFieldService} from '../../core/services/metadata-field.service';
import {Project} from '../../shared/models/project';
import {ProjectService} from '../../core/services/project.service';
import {MetadataValue} from '../../shared/models/metadataValue';
import {SampleDetailModalComponent} from '../../sample/sample-detail-modal/sample-detail-modal.component';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {MetadataFieldModalComponent} from '../metadatafield-modal/metadata-field-modal.component';

@Component({
  selector: 'app-metadatafield-list',
  templateUrl: './metadatafield-list.component.html',
  styleUrls: ['./metadatafield-list.component.css']
})
export class MetadataFieldListComponent implements OnInit {
  public metadataFields: MetadataField[] = [];
  public metadataFieldsByCategory: Map<string, MetadataField[]>;
  public metadataFieldCategories;
  public errorMessage = '';
  private project: Project;

  constructor(private metadatafieldService: MetadataFieldService,
              private projectService: ProjectService,
              private modalService: NgbModal) {
  }

  async ngOnInit() {
    this.project = await this.projectService.getProject();

    this.retrieveMetadataFields();
  }

  private retrieveMetadataFields() {
    this.metadatafieldService.getMetadataFieldsByProject(this.project)
      .subscribe((metadataFields: MetadataField[]) => {
        this.metadataFields = metadataFields;
        this.metadataFieldsByCategory = metadataFields.reduce(
          (hash, item) => {
            return hash.set(item.category, (hash.get(item.category) || []).concat(item));
          }, new Map<string, MetadataField[]>());
        this.metadataFieldCategories = Array.from(this.metadataFieldsByCategory.keys());
      });
  }

  showSearchResults(metadataFields) {
    this.metadataFields = metadataFields;
  }

  editField(metadataField: MetadataField) {
    const modalRef = this.modalService.open(MetadataFieldModalComponent, {size: 'lg', centered: true});
    modalRef.componentInstance.inputMetadataField = metadataField;
    modalRef.result.then(result => {
      if (result === 'created') {
        this.retrieveMetadataFields();
      }
    });
  }

  useDefaultMetadataFields() {
    this.metadatafieldService.useDefaultMetadataFields(this.project)
      .subscribe(value => this.retrieveMetadataFields());
  }
}
