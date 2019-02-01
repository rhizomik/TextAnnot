import { AnnotationService } from './annotation.service';
import { SampleService } from '../sample/sample.service';
import { ActivatedRoute } from '@angular/router';
import {Component, OnDestroy, OnInit} from '@angular/core';
import { Sample } from '../sample/sample';
import { Annotation } from './annotation';
import {flatMap, takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';

@Component({
  selector: 'app-annotations',
  templateUrl: './annotations.component.html',
  styleUrls: ['./annotations.component.css']
})
export class AnnotationsComponent implements OnInit, OnDestroy {

  ngUnsubscribe = new Subject<void>();

  public sample: Sample;
  public selectedText: string;
  public annotations: Annotation[];

  constructor(private route: ActivatedRoute,
              private samplesService: SampleService,
              private annotationService: AnnotationService) { }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    console.log(id);

    this.samplesService.get(id).pipe(
      flatMap(res => {
        this.sample = res;
        return this.annotationService.findBySample(this.sample);
      }),
      takeUntil(this.ngUnsubscribe),
    ).subscribe((annotations: Annotation[]) => this.annotations = annotations);
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  showSelectedText(event: MouseEvent) {
    if (window.getSelection) {
      this.selectedText = window.getSelection().toString();
    }
  }
}
