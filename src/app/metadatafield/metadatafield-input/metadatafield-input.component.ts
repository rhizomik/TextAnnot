import {Component, Input, OnInit} from '@angular/core';
import {MetadataField} from '../../shared/models/metadata-field';
import {MetadataValue} from '../../shared/models/metadataValue';

@Component({
  selector: 'app-metadatafield-input',
  templateUrl: './metadatafield-input.component.html',
  styleUrls: ['./metadatafield-input.component.css']
})
export class MetadatafieldInputComponent implements OnInit {
  public metadataValue: MetadataValue;
  public fieldValue: string;
  public mValue: MetadataValue;
  constructor() { }
  @Input() metadataField: MetadataField;
  @Input() metadataValues: MetadataValue[];

  ngOnInit() {
    this.metadataValues.forEach(metadataVal => {

      if (metadataVal.fieldCategory ===  this.metadataField.category &&
        metadataVal.fieldName ===  this.metadataField.name) {
        this.mValue = metadataVal;
        this.fieldValue = metadataVal.value;
      }
    });
    if (this.mValue === undefined) {
      this.mValue = new MetadataValue();
      this.mValue.value = '';
    }
  }
  onSubmit() {
    this.metadataValue = new MetadataValue();
    this.metadataValue.value = this.fieldValue;
    this.metadataValue.values = this.metadataField;
    this.metadataValue.fieldName = this.metadataField.name;
    return this.metadataValue;
  }
}
