import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Sample} from '../sample';
import {SampleService} from '../sample.service';
import { MetadataTemplate } from '../../metadata-template/metadata-template';
import { MetadataValue } from '../../metadataValue/metadataValue';
import { MetadataValueService } from '../../metadataValue/metadataValue.service';

@Component({
  selector: 'app-sample-detail',
  templateUrl: './sample-detail.component.html'
})
export class SampleDetailComponent implements OnInit {
  sample: Sample = new Sample();
  metadataValuesCategories: IterableIterator<string>;
  metadataValuesByCategory: Map<string, MetadataValue[]>;
  errorMessage: string;
  detailsPageTitle = 'Sample';
  detailsPageSubtitle = 'Details about a Sample';

  constructor(private route: ActivatedRoute,
              private sampleService: SampleService, private metadataValueService: MetadataValueService) {
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    this.sampleService.get(id).subscribe(
      sample => {
        this.sample = sample;
        this.sample.getRelation(MetadataTemplate, 'describedBy').subscribe(
          (metadataTemplate: MetadataTemplate) => sample.describedBy = metadataTemplate);
        this.metadataValueService.findByForA(this.sample).subscribe(
          (metadataValues: MetadataValue[]) => {
            this.metadataValuesByCategory = metadataValues.reduce(
              (hash, item) => {
                return hash.set(item.fieldCategory, (hash.get(item.fieldCategory) || []).concat(item));
              }, new Map<string, MetadataValue[]>());
            this.metadataValuesCategories = this.metadataValuesByCategory.keys();
          });
    });
  }
}
