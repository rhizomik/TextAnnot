import {Component, Input, OnInit, QueryList, ViewChildren} from '@angular/core';
import {MetadataField} from '../../shared/models/metadata-field';
import {MetadataFieldService} from '../../core/services/metadata-field.service';
import {MetadatafieldInputComponent} from '../../metadatafield/metadatafield-input/metadatafield-input.component';
import {MetadataValue} from '../../shared/models/metadataValue';
import {MetadataValueService} from '../../core/services/metadataValue.service';
import {Sample} from '../../shared/models/sample';
import {ProjectService} from '../../core/services/project.service';
import {Project} from '../../shared/models/project';

@Component({
  selector: 'app-sample-fields-form',
  templateUrl: './sample-fields-form.html'
})
export class SampleFieldsFormComponent implements OnInit {
  @ViewChildren(MetadatafieldInputComponent) childs: QueryList<MetadatafieldInputComponent>;
  public metadataFields: MetadataField[] = [];
  public values: MetadataValue[] = [];
  public metadataValues: MetadataValue[] = [];
  public metadataFieldsByCategory: Map<string, MetadataField[]>;
  public metadataFieldsCategories: string[];

  constructor(private metadataService: MetadataFieldService, private metadataValueService: MetadataValueService) {
  }

  @Input() sample: Sample;
  @Input() project: Project;

  ngOnInit() {
    this.metadataService.getMetadataFieldsByProject(this.project).subscribe(
      (metadataFields: MetadataField[]) => {
        this.metadataFields = metadataFields;
        this.metadataFieldsByCategory = metadataFields.reduce((previousValue, currentValue) =>
            previousValue.set(currentValue.category, (previousValue.get(currentValue.category) || []).concat(currentValue)),
          new Map<string, MetadataField[]>());
        this.metadataFieldsCategories = Array.from(this.metadataFieldsByCategory.keys());
      });

    if (this.sample != null) {
      this.metadataValueService.findByForA(this.sample).subscribe((metadataValue: MetadataValue[]) => {
        this.metadataValues = metadataValue;
      });
    }
  }
  onSubmit() {
    const childsArray = this.childs.toArray();
    for (const child of childsArray) {
      this.values.push(child.onSubmit());
    }
    return this.values;
  }
}
