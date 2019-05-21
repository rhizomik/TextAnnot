import {Component, Input, OnInit, QueryList, ViewChildren} from '@angular/core';
import {MetadataField} from '../../metadatafield/metadata-field';
import {MetadataFieldService} from '../../metadatafield/metadata-field.service';
import {MetadatafieldInputComponent} from '../../metadatafield/metadatafield-input/metadatafield-input.component';
import {MetadataValue} from '../../metadataValue/metadataValue';
import {MetadataValueService} from '../../metadataValue/metadataValue.service';
import {Sample} from '../sample';

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

  @Input() metadataTemplateUri: string;
  @Input() sample: Sample;

  ngOnInit() {
    this.metadataService.getMetadataFieldsByMetadataTemplate(this.metadataTemplateUri).subscribe(
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
