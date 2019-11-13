import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {MetadataFieldService} from '../../core/services/metadata-field.service';
import {MetadatafieldValueCounts} from '../../shared/models/metadatafield-value-counts';

@Component({
  selector: 'app-metadatafield-edit-values',
  templateUrl: './metadatafield-edit-values.component.html',
  styleUrls: ['./metadatafield-edit-values.component.css']
})
export class MetadatafieldEditValuesComponent implements OnInit {

  id: string;
  metadataFieldValueCounts: MetadatafieldValueCounts;
  editing = false;
  filteredValueCounts: [string, number][];
  newValues: [string, string][];

  constructor(private route: ActivatedRoute,
              private metadataFieldService: MetadataFieldService
              ) { }

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
    this.getMetadataFieldValueCounts();
  }

  private getMetadataFieldValueCounts() {
    this.metadataFieldService.getMetadataFieldValuesCount(this.id).subscribe(value => {
      this.metadataFieldValueCounts = value;
      this.filter('');
    });
  }

  filter(text: string) {
    this.filteredValueCounts = Object.entries(this.metadataFieldValueCounts.valueCounts)
      .filter(value => value[0].includes(text))
      .sort((a, b) => a[1] === b[1] ? (a[0] > b[0] ? 1 : -1) : b[1] - a[1]);
  }

  switchEditing() {
    this.editing = !this.editing;
    this.newValues = [];
  }

  submit() {
    this.metadataFieldService.renameMetadataFieldValues(this.id, this.newValues).subscribe(
      () => this.getMetadataFieldValueCounts()
    );
    this.switchEditing();
  }

  setNewValue(oldValue: string, value: string) {
    this.newValues.push([oldValue, value]);
    console.log(this.newValues);
  }
}
