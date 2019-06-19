import {Component, Input, OnInit} from '@angular/core';
import {FilteredSample, Sample} from '../../shared/models/sample';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {SampleService} from '../../core/services/sample.service';
import {MetadataValueService} from '../../core/services/metadataValue.service';
import {MetadataValue} from '../../shared/models/metadataValue';

@Component({
  selector: 'app-sample-detail-modal',
  templateUrl: './sample-detail-modal.component.html',
  styleUrls: ['./sample-detail-modal.component.css']
})
export class SampleDetailModalComponent implements OnInit {

  @Input() sample: Sample;
  metadataValuesByCategory: Map<string, MetadataValue[]>;
  metadataValuesCategories: string[];

  constructor(public activeModal: NgbActiveModal,
              private sampleService: SampleService,
              private metadataValueService: MetadataValueService) { }

  ngOnInit() {
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

  closeModal() {
    this.activeModal.dismiss('OK');
  }

}
