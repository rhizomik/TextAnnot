import {Component, OnInit} from '@angular/core';
import {SampleService} from '../sample.service';
import {FilteredSample, Sample} from '../sample';
import { MetadataTemplate } from '../../metadata-template/metadata-template';

@Component({
  selector: 'app-sample-list',
  templateUrl: './sample-list.component.html',
  styleUrls: ['./sample-list.component.css']
})
export class SampleListComponent implements OnInit {

  public samples: Sample[] = [];
  public filteredSamples: FilteredSample[];
  public totalSamples = 0;
  public errorMessage = '';

  constructor(private sampleService: SampleService) {
  }

  ngOnInit() {
    this.sampleService.getAll().subscribe(
      (samples: Sample[]) => {
        this.samples = samples;
        this.totalSamples = samples.length;

        // Get the metadata template for each sample
        this.samples.map(
          (sample: Sample) => {
            sample.getRelation(MetadataTemplate, 'describedBy').subscribe(
              (metadataTemplate: MetadataTemplate) => sample.describedBy = metadataTemplate
            );
          }
        );
      });
  }

  showSearchResults(samples: FilteredSample[]) {
    this.samples = samples;
  }
}
