import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {MetadataFieldService} from '../metadata-field.service';
import {MetadatafieldValueCounts} from '../metadatafield-value-counts';

@Component({
  selector: 'app-metadatafield-edit-values',
  templateUrl: './metadatafield-edit-values.component.html',
  styleUrls: ['./metadatafield-edit-values.component.css']
})
export class MetadatafieldEditValuesComponent implements OnInit {

  metadataFieldValueCounts: MetadatafieldValueCounts;
  editing = false;
  filteredValueCounts: [string, number][];

  constructor(private route: ActivatedRoute,
              private metadataFieldService: MetadataFieldService
              ) { }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    this.metadataFieldService.getMetadataFieldValuesCount(id).subscribe(value => {
      this.metadataFieldValueCounts = value;
      this.filter('');
    });
  }

  filter(text: string) {
    this.filteredValueCounts = Object.entries(this.metadataFieldValueCounts.valueCounts)
      .filter(value => value[0].includes(text))
      .sort((a, b) => b[1] - a[1]);
  }

  switchEditing() {
    this.editing = !this.editing;
    // if (this.editing) {
    //
    // }
  }

  submit() {
    this.switchEditing();
  }
}
