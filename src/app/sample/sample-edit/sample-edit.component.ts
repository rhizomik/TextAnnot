import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Router} from '@angular/router';
import {Sample} from '../../shared/models/sample';
import {SampleService} from '../../core/services/sample.service';
import {SampleFieldsFormComponent} from '../sample-fields-form/sample-fields-form.component';
import {MetadataValue} from '../../shared/models/metadataValue';
import {forkJoin, Observable} from 'rxjs/index';
import {flatMap} from 'rxjs/operators';
import {MetadataValueService} from '../../core/services/metadataValue.service';
import {Location} from '@angular/common';
import {ProjectService} from '../../core/services/project.service';
import {Project} from '../../shared/models/project';

@Component({
  selector: 'app-sample-edit',
  templateUrl: 'sample-edit.component.html'
})
export class SampleEditComponent implements OnInit {
  @ViewChild(SampleFieldsFormComponent) child: SampleFieldsFormComponent;
  public sample: Sample;
  public project: Project;
  public errorMessage: string;
  public values: MetadataValue[] = [];
  public metadataValues: MetadataValue[] = [];

  constructor(private route: ActivatedRoute, private router: Router, private sampleService: SampleService,
              private projectService: ProjectService, private metadataValueService: MetadataValueService,
              private location: Location) {
  }

  async ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    this.sampleService.get(id).subscribe(
      sample => {
        this.sample = sample;
      });
    this.project = await this.projectService.getProject();
  }

  onSubmit(): void {
    const update$: Observable<Sample> = this.sampleService.update(this.sample) as Observable<Sample>;
    update$.pipe(
      flatMap((sample: Sample) => forkJoin(this.creationMetadataValues(sample))),
      flatMap(() => forkJoin(this.deleteMetadataValues()))
    ).subscribe(() => this.router.navigate(['samples', this.sample.id]));
  }

  creationMetadataValues(sample): Observable<MetadataValue>[] {
    this.values = this.child.onSubmit();
    return this.values.filter(value => value.value)
      .map(value => {
        value.forA = sample;
        return this.metadataValueService.create(value) as Observable<MetadataValue>;
      });
  }

  deleteMetadataValues(): Observable<MetadataValue>[] {
    this.metadataValues = this.child.metadataValues;
    return this.metadataValues.filter(value => value)
      .map(value => {
        return this.metadataValueService.delete(value) as Observable<MetadataValue>;
      });
  }

  goBack() {
    this.location.back();
  }
}
