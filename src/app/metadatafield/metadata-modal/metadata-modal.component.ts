import {Component, Input, OnInit} from '@angular/core';
import {Sample} from '../../shared/models/sample';
import {MetadataValue} from '../../shared/models/metadataValue';
import {MetadataValueService} from '../../core/services/metadataValue.service';

@Component({
  selector: 'app-metadata-modal',
  templateUrl: './metadata-modal.component.html',
  styleUrls: ['./metadata-modal.component.css']
})
export class MetadataModalComponent implements OnInit {

  @Input() sample: Sample;
  metadataValuesByCategory: Map<string, MetadataValue[]>;
  metadataValuesCategories: string[];

  constructor(
    private metadataValueService: MetadataValueService
  ) { }

  ngOnInit() {
    this.metadataValueService.findByForA(this.sample).subscribe(
      (metadataValues: MetadataValue[]) => {
        this.metadataValuesByCategory = metadataValues.reduce(
          (hash, item) => {
            return hash.set(item.fieldCategory, (hash.get(item.fieldCategory) || []).concat(item));
          }, new Map<string, MetadataValue[]>());
        this.metadataValuesCategories = Array.from(this.metadataValuesByCategory.keys());
      });
  }

}
