import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {flatMap, map, sample, takeUntil} from 'rxjs/operators';
import {Annotation} from '../annotation';
import {forkJoin, Subject} from 'rxjs';
import {Sample} from '../../sample/sample';
import {AnnotationService} from '../annotation.service';
import {Tag} from '../../tag/tag';
import {AnnotationHighlight} from '../annotation-highlight';

@Component({
  selector: 'app-annotation-list',
  templateUrl: './annotation-list.component.html',
  styleUrls: ['./annotation-list.component.css']
})
export class AnnotationListComponent implements OnInit, OnDestroy {

  @Input() sample: Sample;
  annotations: Annotation[] = [];

  activeAnnotations: AnnotationHighlight[] = [];


  ngUnsubscribe = new Subject<void>();

  constructor(
    private annotationService: AnnotationService,
  ) { }

  ngOnInit() {
    this.annotationService.findBySample(this.sample).pipe(
      flatMap((annotations: Annotation[]) =>  forkJoin(annotations.map(this.annotationService.fillAnnotation))),
      takeUntil(this.ngUnsubscribe),
    ).subscribe((annotations: Annotation[]) => {
      this.annotations = annotations;
      this.sortAnnotations();
    });

    this.annotationService.newAnnotation.subscribe(value => {
      this.annotations.push(value);
      this.sortAnnotations();
    });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  private sortAnnotations() {
    this.annotations.sort((a, b) => a.start - b.start);
  }

  highlightAnnot(annotation: Annotation) {
    if (!annotation['active']) {
      this.activeAnnotations.push(new AnnotationHighlight({id: annotation.id, pos: annotation.start, starting: true}));
      this.activeAnnotations.push(new AnnotationHighlight({id: annotation.id, pos: annotation.end, starting: false}));
    } else {
      this.activeAnnotations = this.activeAnnotations.filter(value => value['id'] !== annotation.id);
    }

    annotation['active'] = ! annotation['active'];
    this.annotationService.updateHighlightedAnnot(this.activeAnnotations);
  }

  highlightAll() {
    this.activeAnnotations = [];
    this.annotations.forEach(value => {
      this.activeAnnotations.push(
        new AnnotationHighlight({id: value.id, pos: value.start, starting: true}),
        new AnnotationHighlight({id: value.id, pos: value.end, starting: false}));
      value['active'] = true;
    });
    this.annotationService.updateHighlightedAnnot(this.activeAnnotations);
  }

  highlightNone() {
    this.activeAnnotations = [];
    this.annotationService.updateHighlightedAnnot(this.activeAnnotations);
    this.annotations.forEach(value => value['active'] = false);
  }

}
