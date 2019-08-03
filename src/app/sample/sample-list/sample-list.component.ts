import {Component, OnInit, ViewChild} from '@angular/core';
import {SampleService} from '../../core/services/sample.service';
import {FilteredSample, Sample} from '../../shared/models/sample';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {SampleDetailModalComponent} from '../sample-detail-modal/sample-detail-modal.component';
import {SampleSearchComponent} from '../sample-search/sample-search.component';
import {PageEvent} from '@angular/material';
import {SampleStatistics} from '../../shared/models/sample-statistics';
import {SampleSearchStatisticsModalComponent} from '../sample-search-statistics-modal/sample-search-statistics-modal.component';
import {Project} from '../../shared/models/project';
import {ProjectService} from '../../core/services/project.service';
import {TagService} from '../../core/services/tag.service';

@Component({
  selector: 'app-sample-list',
  templateUrl: './sample-list.component.html',
  styleUrls: ['./sample-list.component.css']
})
export class SampleListComponent implements OnInit {

  @ViewChild(SampleSearchComponent)
  private sampleSearchComponent: SampleSearchComponent;

  private project: Project;
  public filteredSamplesByWord: FilteredSample[] = [];
  public filteredSamplesByMetadata: Sample[] = [];
  public statistics: SampleStatistics;
  public errorMessage = '';
  public totalSamples = 0;
  public totalPages = 0;
  public currentPage: number;
  public pageSize = 20;
  public statisticsEnabled = false;

  constructor(private sampleService: SampleService,
              private projectService: ProjectService,
              private tagService: TagService,
              private modalService: NgbModal) {
  }

  async ngOnInit() {
    this.project = await this.projectService.getProject();
    this.sampleService.getSamplesByProject(this.project).subscribe(
      (samples: Sample[]) => {
        this.filteredSamplesByMetadata = samples;
        this.totalSamples = this.sampleService.totalElement();
        this.totalPages = this.sampleService.totalPages();
      });
  }

  async showSearchResults(samples: Sample[]) {
    if (this.sampleSearchComponent.searchTerm || this.sampleSearchComponent.filteredTags.length > 0) {
      this.filteredSamplesByWord = await this.sampleService.convertToFilteredSamples(samples,
        this.sampleSearchComponent.searchTerm, this.sampleSearchComponent.filteredTags);
      this.filteredSamplesByMetadata = [];
    } else {
      this.filteredSamplesByMetadata = samples;
      this.filteredSamplesByWord = [];
    }
    this.statisticsEnabled = this.sampleSearchComponent.filteredTags.length > 0;
    this.currentPage = 0;
    this.totalSamples = this.sampleService.totalElement();
    this.totalPages = this.sampleService.totalPages();
  }

  receiveStatistics(statistics: SampleStatistics) {
    this.statistics = statistics;
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
    this.currentPage = event.pageIndex;
  }

  nextPage() {
    this.sampleService.next().subscribe(value => this.updatePageSamples(value));
  }

  prevPage() {
    this.sampleService.prev().subscribe(value => this.updatePageSamples(value));
  }

  firstPage() {
    this.sampleService.first().subscribe(value => this.updatePageSamples(value));
  }

  lastPage() {
    this.sampleService.last().subscribe(value => this.updatePageSamples(value));
  }

  openStatisticsModal() {
    const modalRef = this.modalService.open(SampleSearchStatisticsModalComponent, {size: 'lg', centered: true});
    modalRef.componentInstance.statistics = this.statistics;
  }

  openSampleDetailModal(sample: Sample) {
    const modalRef = this.modalService.open(SampleDetailModalComponent, {size: 'lg', centered: true});
    modalRef.componentInstance.sample = sample;
  }

  private async updatePageSamples(value: Sample[]) {
    if (this.filteredSamplesByWord.length > 0) {
      this.filteredSamplesByWord = await this.sampleService.convertToFilteredSamples(value, this.sampleSearchComponent.searchTerm,
        this.sampleSearchComponent.filteredTags);
    } else {
      this.filteredSamplesByMetadata = value;
    }
  }

  downloadCSV() {
    this.sampleSearchComponent.exportCSV();
  }
}
