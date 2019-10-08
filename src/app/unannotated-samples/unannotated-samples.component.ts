import { Component, OnInit } from '@angular/core';
import {ProjectService} from '../core/services/project.service';
import {Project} from '../shared/models/project';
import {SampleService} from '../core/services/sample.service';
import {Sample} from '../shared/models/sample';
import {Router} from '@angular/router';
import {PageEvent} from '@angular/material';
import {AnnotationStatusService} from '../core/services/annotation-status.service';
import {AnnotationStatus} from '../shared/models/annotation-status';

@Component({
  selector: 'app-unannotated-samples',
  templateUrl: './unannotated-samples.component.html',
  styleUrls: ['./unannotated-samples.component.css']
})
export class UnannotatedSamplesComponent implements OnInit {
  private project: Project;
  public unannotatedSamples: Sample[];
  public currentPage: number;
  public totalPages: number;
  public totalSamples: number;
  public pageSize = 20;
  public annotationStatuses: AnnotationStatus[];
  public samplesByStatus: Map<string, Sample[]> = new Map();

  constructor(
    private projectService: ProjectService,
    private sampleService: SampleService,
    private router: Router,
    private annotationStatusService: AnnotationStatusService
  ) { }

  async ngOnInit() {
    this.project = await this.projectService.getProject();
    this.annotationStatusService.getAllByProject(this.project)
      .subscribe((annotStatuses: AnnotationStatus[]) => {
        this.annotationStatuses = annotStatuses;
        return annotStatuses.map(status =>
          this.getAnnotationStatusSamples(status));
      });
    this.sampleService.findByProjectAndNotAnnotated(this.project)
      .subscribe(samples => {
        this.unannotatedSamples = samples;
        this.totalSamples = this.sampleService.totalElement();
        this.totalPages = this.sampleService.totalPages();
    });
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
    this.sampleService.next().subscribe(value => this.unannotatedSamples = value);
  }

  prevPage() {
    this.sampleService.prev().subscribe(value => this.unannotatedSamples = value);
  }

  firstPage() {
    this.sampleService.first().subscribe(value => this.unannotatedSamples = value);
  }

  lastPage() {
    this.sampleService.last().subscribe(value => this.unannotatedSamples = value);
  }

  annotateSample(sample: Sample) {
    this.router.navigate(['annotations', sample.id]);
  }

  private getAnnotationStatusSamples(annotStatus: AnnotationStatus) {
    this.sampleService.getByAnnotationStatus(annotStatus)
      .subscribe(samples => this.samplesByStatus.set(annotStatus.name, samples));
  }
}
