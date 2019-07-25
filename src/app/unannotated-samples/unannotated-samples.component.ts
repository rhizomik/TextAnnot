import { Component, OnInit } from '@angular/core';
import {ProjectService} from '../core/services/project.service';
import {Project} from '../shared/models/project';
import {SampleService} from '../core/services/sample.service';
import {Sample} from '../shared/models/sample';
import {Router} from '@angular/router';

@Component({
  selector: 'app-unannotated-samples',
  templateUrl: './unannotated-samples.component.html',
  styleUrls: ['./unannotated-samples.component.css']
})
export class UnannotatedSamplesComponent implements OnInit {
  private project: Project;
  private samples: Sample[];

  constructor(
    private projectService: ProjectService,
    private sampleService: SampleService,
    private router: Router,
  ) { }

  async ngOnInit() {
    this.project = await this.projectService.getProject();
    this.sampleService.findByProjectAndNotAnnotated(this.project)
      .subscribe(samples => {
        this.samples = samples;
    });
  }

  annotateSample(sample: Sample) {
    this.router.navigate(['annotations', sample.id]);
  }
}
