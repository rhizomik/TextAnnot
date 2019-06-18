import {Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Router} from '@angular/router';
import {MetadataField} from '../../shared/models/metadata-field';
import {MetadataFieldService} from '../../core/services/metadata-field.service';
import {flatMap, map} from 'rxjs/operators';
import {Project} from '../../shared/models/project';
import {ProjectService} from '../../core/services/project.service';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-metadatafield-edit',
  templateUrl: './metadata-field-modal.component.html'
})
export class MetadataFieldModalComponent implements OnInit {
  public errorMessage: string;

  private project: Project;

  @Input()
  public metadataField: MetadataField;

  public creating = false;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private metadatafieldService: MetadataFieldService,
              private projectService: ProjectService,
              private modal: NgbActiveModal) {
  }

  async ngOnInit() {
    this.project = await this.projectService.getProject();
    if (!this.metadataField) {
      this.metadataField = new MetadataField();
      this.metadataField.definedAt = this.project;
      this.creating = true;
    }

  }

  onSubmit(): void {
    if (this.creating) {
      this.metadatafieldService.create(this.metadataField).subscribe(
        value => this.modal.close('created')
      );
    } else {
      this.metadatafieldService.update(this.metadataField)
        .subscribe(
          (metadatafield: MetadataField) => this.modal.close('modified'));
    }
  }

  closeModal() {
    this.modal.close();
  }
}
