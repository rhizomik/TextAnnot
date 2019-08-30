import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Router} from '@angular/router';
import {MetadataField} from '../../shared/models/metadata-field';
import {MetadataFieldService} from '../../core/services/metadata-field.service';
import {flatMap, map} from 'rxjs/operators';
import {Project} from '../../shared/models/project';
import {ProjectService} from '../../core/services/project.service';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {ErrorMessageService} from '../../error-handler/error-message.service';

@Component({
  selector: 'app-metadatafield-edit',
  templateUrl: './metadata-field-modal.component.html'
})
export class MetadataFieldModalComponent implements OnInit, OnDestroy {

  private project: Project;

  @Input()
  public inputMetadataField: MetadataField;

  public metadataField: MetadataField;

  public creating = false;
  public errMessage: string;
  public showAlert = false;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private metadatafieldService: MetadataFieldService,
              private projectService: ProjectService,
              private modal: NgbActiveModal,
              private errorService: ErrorMessageService) {
  }

  async ngOnInit() {
    this.errorService.disableErrorsHandler();
    this.project = await this.projectService.getProject();
    if (!this.inputMetadataField) {
      this.metadataField = new MetadataField();
      this.metadataField.definedAt = this.project;
      this.metadataField.privateField = false;
      this.metadataField.includeStatistics = false;
      this.creating = true;
    } else {
      this.metadataField = Object.assign({}, this.inputMetadataField, MetadataField);
    }
  }

  ngOnDestroy(): void {
    this.errorService.enableErrorsHandler();
  }

  onSubmit(): void {
    if (this.creating) {
      this.metadatafieldService.create(this.metadataField).subscribe(
        value => this.modal.close('created')
      );
    } else {
      this.metadatafieldService.update(this.metadataField)
        .subscribe(
          (metadatafield: MetadataField) => {
            this.inputMetadataField = Object.assign(this.inputMetadataField, this.metadataField);
            this.modal.close('modified');
          },
          error => {
            this.errMessage = error['error']['message'];
            this.showAlert = true;
            setTimeout(() => this.showAlert = false, 10000);
          });
    }
  }

  closeModal() {
    this.modal.close();
  }
}
