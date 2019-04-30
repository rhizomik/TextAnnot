import {Component, Input, OnInit} from '@angular/core';
import {FilteredSample} from '../sample';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {SampleService} from '../sample.service';
import {MetadataValueService} from '../../metadataValue/metadataValue.service';
import {MetadataTemplate} from '../../metadata-template/metadata-template';
import {MetadataValue} from '../../metadataValue/metadataValue';

@Component({
  selector: 'app-sample-detail-modal',
  templateUrl: './sample-detail-modal.component.html',
  styleUrls: ['./sample-detail-modal.component.css']
})
export class SampleDetailModalComponent implements OnInit {

  @Input() sample: FilteredSample;
  metadataValuesByCategory: Map<string, MetadataValue[]>;
  metadataValuesCategories: string[];

  constructor(public activeModal: NgbActiveModal,
              private sampleService: SampleService,
              private metadataValueService: MetadataValueService) { }

  ngOnInit() {
    this.sample.getRelation(MetadataTemplate, 'describedBy').subscribe(
    (metadataTemplate: MetadataTemplate) => this.sample.describedBy = metadataTemplate);
    this.metadataValueService.findByForA(this.sample).subscribe(
      (metadataValues: MetadataValue[]) => {
        this.metadataValuesByCategory = metadataValues.reduce(
          (hash, item) => {
            return hash.set(item.fieldCategory, (hash.get(item.fieldCategory) || []).concat(item));
          }, new Map<string, MetadataValue[]>());
        this.metadataValuesCategories = Array.from(this.metadataValuesByCategory.keys());
        console.log(this.metadataValuesByCategory.entries());
      });
  }

}
