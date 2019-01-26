import { AnnotationService } from './annotation.service';
import { SampleService } from './../sample/sample.service';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Sample } from '../sample/sample';
import { Annotation } from './annotation';

@Component({
  selector: 'app-annotations',
  templateUrl: './annotations.component.html',
  styleUrls: ['./annotations.component.css']
})
export class AnnotationsComponent implements OnInit {

  public sample: Sample;
  public annotations: Annotation[];

  constructor(private route: ActivatedRoute,
              private samplesService: SampleService,
              private annotationService: AnnotationService) { }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    console.log(id);

    this.samplesService.get(id).subscribe(res => {
      this.sample = res;
      this.annotationService.findBySample(this.sample).subscribe(annotations => this.annotations = annotations);
    });
  }

}
