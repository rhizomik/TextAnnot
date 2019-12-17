import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Sample } from '../../shared/models/sample';
import { SampleService } from '../../core/services/sample.service';
import { MetadataValue } from '../../shared/models/metadataValue';
import { MetadataValueService } from '../../core/services/metadataValue.service';
import { flatMap } from 'rxjs/operators';
import { forkJoin } from 'rxjs/internal/observable/forkJoin';

@Component({
  selector: 'app-sample-delete',
  templateUrl: './sample-delete.component.html'
})
export class SampleDeleteComponent implements OnInit {
  public mSample: Sample = new Sample();
  public metadataValues: MetadataValue[] = [];
  public errorMessage: string;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private sampleService: SampleService,
              private metadataValueService: MetadataValueService) {
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    this.sampleService.get(id).subscribe(sample => {
      this.mSample = sample;
    });
  }

  delete() {
    this.metadataValueService.findByForA(this.mSample).pipe(
      flatMap((values: MetadataValue[]) => forkJoin(values.map(value => this.metadataValueService.delete(value)))),
      flatMap( () => this.sampleService.delete(this.mSample))
    ).subscribe(() => this.router.navigate(['samples']));
  }
}
