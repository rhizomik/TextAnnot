import { Component, OnInit } from '@angular/core';
import {AnnotationStatus} from '../shared/models/annotation-status';
import {AnnotationStatusService} from '../core/services/annotation-status.service';
import {ProjectService} from '../core/services/project.service';
import {Project} from '../shared/models/project';

@Component({
  selector: 'app-annotation-statuses',
  templateUrl: './annotation-statuses.component.html',
  styleUrls: ['./annotation-statuses.component.css']
})
export class AnnotationStatusesComponent implements OnInit {

  annotationStatuses: AnnotationStatus[] = [];

  project: Project;

  constructor(private annotationStatusService: AnnotationStatusService,
              private projectService: ProjectService) { }

  async ngOnInit() {
    this.project = await this.projectService.getProject();

    this.annotationStatusService.getAllByProject(this.project).subscribe(statuses => {
      this.annotationStatuses = statuses;
    });
  }

  deleteAnnotationStatus(i: number) {
    this.annotationStatusService.delete(this.annotationStatuses[i]).subscribe(value => this.annotationStatuses.splice(i, 1));
  }

  addStatus(newStatusName: HTMLInputElement) {
    const annotStatus = new AnnotationStatus();
    annotStatus.name = newStatusName.value;
    annotStatus.definedAt = this.project;
    this.annotationStatusService.create(annotStatus).subscribe((value: AnnotationStatus) => {
      this.annotationStatuses.push(value);
      newStatusName.value = '';
    });
  }
}
