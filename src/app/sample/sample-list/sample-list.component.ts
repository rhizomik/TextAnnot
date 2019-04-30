import {Component, OnInit} from '@angular/core';
import {SampleService} from '../sample.service';
import {FilteredSample, Sample} from '../sample';
import { MetadataTemplate } from '../../metadata-template/metadata-template';
import {NgbModal, NgbPopover} from '@ng-bootstrap/ng-bootstrap';
import {SampleDetailModalComponent} from '../sample-detail-modal/sample-detail-modal.component';

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

  constructor(private sampleService: SampleService,
              private modalService: NgbModal) {
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

  openModal(sample: FilteredSample) {
    const modalRef = this.modalService.open(SampleDetailModalComponent, {size: 'lg', centered: true});
    modalRef.componentInstance.sample = sample;
  }
}
