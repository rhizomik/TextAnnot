import {Component, OnInit} from '@angular/core';
import {MetadataField} from '../../shared/models/metadata-field';
import {MetadataFieldService} from '../../core/services/metadata-field.service';
import {Project} from '../../shared/models/project';
import {ProjectService} from '../../core/services/project.service';
import {MetadataValue} from '../../shared/models/metadataValue';

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
              private projectService: ProjectService) {
  }

  async ngOnInit() {
    this.project = await this.projectService.getProject();

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
}
