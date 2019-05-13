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

  constructor(private metadataService: MetadataFieldService, private metadataValueService: MetadataValueService) {
  }

  @Input() metadataTemplateUri: string;
  @Input() sample: Sample;

  ngOnInit() {
    this.metadataService.getMetadataFieldsByMetadataTemplate(this.metadataTemplateUri).subscribe(
      (metadataFields: MetadataField[]) => {
        this.metadataFields = metadataFields;
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
