import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Sample} from '../../shared/models/sample';
import {SampleService} from '../../core/services/sample.service';

@Component({
  selector: 'app-sample-delete',
  templateUrl: './sample-delete.component.html'
})
export class SampleDeleteComponent implements OnInit {
  public mSample: Sample = new Sample();
  public errorMessage: string;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private sampleService: SampleService) {
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    this.sampleService.get(id).subscribe(
      msample => this.mSample = msample);
  }

  delete() {
    this.sampleService.delete(this.mSample).subscribe(
      () => this.router.navigate(['samples']));
  }
}
