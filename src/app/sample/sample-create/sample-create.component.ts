import { Component, ViewChild, OnInit } from '@angular/core';
import { SampleFieldsFormComponent } from '../sample-fields-form/sample-fields-form.component';
import { Router } from '@angular/router';
import { Sample } from '../sample';
import { SampleService } from '../sample.service';
import { MetadataTemplate } from '../../metadata-template/metadata-template';
import { MetadataTemplateService } from '../../metadata-template/metadata-template.service';
import { MetadataValueService } from '../../metadataValue/metadataValue.service';
import { MetadataValue } from '../../metadataValue/metadataValue';
import {forkJoin, Observable} from 'rxjs/index';
import { flatMap, map } from 'rxjs/operators';
import {Project} from '../../shared/modal/project';
import {ProjectService} from '../../core/project.service';

@Component({
  selector: 'app-sample-create',
  templateUrl: '../sample-form/sample-form.component.html'
})
export class SampleCreateComponent implements OnInit {
  @ViewChild(SampleFieldsFormComponent) child: SampleFieldsFormComponent;
  public sample = new Sample();
  public errorMessage: string;
  public formTitle = 'Create Sample';
  public formSubtitle = 'Creates a new sample';
  public uriMetadataTemplate: string;
  public values: MetadataValue[] = [];
  constructor(private router: Router,
              private sampleService: SampleService,
              private projectService: ProjectService,
              private metadataValueService: MetadataValueService) { }

  async ngOnInit() {
    this.sample.project = await this.projectService.getProject();
  }

  onSubmit(): void {
    const create$: Observable<Sample> = this.sampleService.create(this.sample) as Observable<Sample>;
    create$.pipe(
      flatMap((sample: Sample) => forkJoin(...this.creationMetadataValues(sample)))
    ).subscribe(() => this.router.navigate(['/samples']));
  }

  creationMetadataValues(sample): Observable<MetadataValue>[] {
    this.values = this.child.onSubmit();
    return this.values.filter(value => value.value)
      .map(value => {
        value.forA = sample;
        return this.metadataValueService.create(value) as Observable<MetadataValue>;
      });
  }
}
