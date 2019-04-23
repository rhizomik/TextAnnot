import {Component, OnInit} from '@angular/core';
import {SampleService} from '../sample.service';
import {FilteredSample, Sample} from '../sample';
import { MetadataTemplate } from '../../metadata-template/metadata-template';
import {NgbPopover} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-sample-list',
  templateUrl: './sample-list.component.html',
  styleUrls: ['./sample-list.component.css']
})
export class SampleListComponent implements OnInit {

  public samples: FilteredSample[] = [];
  public filteredSamples: FilteredSample[];
  public totalSamples = 0;
  public errorMessage = '';

  constructor(private sampleService: SampleService) {
  }

  ngOnInit() {
    // this.sampleService.getAll().subscribe(
    //   (samples: Sample[]) => {
    //     this.samples = samples.map(value => <FilteredSample>value);
    //     this.totalSamples = samples.length;
    //   });
  }

  showSearchResults(samples: FilteredSample[]) {
    this.samples = samples;
  }

  togglePopover(ngbPopover: NgbPopover, sample: FilteredSample) {
    ngbPopover.open({sample});
  }
}
