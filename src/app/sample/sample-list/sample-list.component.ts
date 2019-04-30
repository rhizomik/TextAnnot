import {Component, OnInit, ViewChild} from '@angular/core';
import {SampleService} from '../sample.service';
import {FilteredSample, Sample} from '../sample';
import { MetadataTemplate } from '../../metadata-template/metadata-template';
import {NgbModal, NgbPopover} from '@ng-bootstrap/ng-bootstrap';
import {SampleDetailModalComponent} from '../sample-detail-modal/sample-detail-modal.component';
import {SampleSearchComponent} from '../sample-search/sample-search.component';
import {PageEvent} from '@angular/material';

@Component({
  selector: 'app-sample-list',
  templateUrl: './sample-list.component.html',
  styleUrls: ['./sample-list.component.css']
})
export class SampleListComponent implements OnInit {

  @ViewChild(SampleSearchComponent)
  private sampleSearchComponent: SampleSearchComponent;

  public samples: FilteredSample[] = [];
  public errorMessage = '';
  public totalSamples = 0;
  public totalPages = 0;
  public currentPage: number;
  public pageSize = 20;


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

  showSearchResults(samples: Sample[]) {
    this.samples = this.sampleService.convertToFilteredSamples(samples, this.sampleSearchComponent.searchTerm);
    this.totalSamples = this.sampleService.totalElement();
    this.totalPages = this.sampleService.totalPages();

  }

  openModal(sample: FilteredSample) {
    const modalRef = this.modalService.open(SampleDetailModalComponent, {size: 'lg', centered: true});
    modalRef.componentInstance.sample = sample;
  }

  handlePagination(event: PageEvent) {
    if (event.pageIndex - event.previousPageIndex === 1) {
      this.nextPage();
    } else if (event.pageIndex - event.previousPageIndex === -1) {
      this.prevPage();
    } else if (event.pageIndex === 0) {
      this.firstPage();
    } else if (this.totalPages - event.pageIndex === 1) {
      this.lastPage();
    }
  }

  nextPage() {
    this.sampleService.next().subscribe(value =>
      this.samples = this.sampleService.convertToFilteredSamples(value, this.sampleSearchComponent.searchTerm));
  }

  prevPage() {
    this.sampleService.prev().subscribe(value =>
      this.samples = this.sampleService.convertToFilteredSamples(value, this.sampleSearchComponent.searchTerm));
  }

  firstPage() {
    this.sampleService.first().subscribe(value =>
      this.samples = this.sampleService.convertToFilteredSamples(value, this.sampleSearchComponent.searchTerm));
  }

  lastPage() {
    this.sampleService.last().subscribe(value =>
      this.samples = this.sampleService.convertToFilteredSamples(value, this.sampleSearchComponent.searchTerm));
  }
}
