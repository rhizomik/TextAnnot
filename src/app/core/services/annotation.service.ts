import { Annotation } from '../../shared/models/annotation';
import { HttpClient } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { RestService } from 'angular4-hal-aot';
import { Observable } from 'rxjs/internal/Observable';
import { Sample } from '../../shared/models/sample';
import {BehaviorSubject, Subject} from 'rxjs';
import {AnnotationHighlight} from '../../annotations/annotation-highlight';
import {Tag} from '../../shared/models/tag';
import {map} from 'rxjs/operators';
import {TextSelection} from '../../shared/models/text-selection';

@Injectable()
export class AnnotationService extends RestService<Annotation> {

  highlightedAnnotations = new Subject<AnnotationHighlight[]>();
  newAnnotation = new Subject<Annotation>();
  textSelection = new Subject<TextSelection>();

  constructor(injector: Injector, private http: HttpClient) {
    super(Annotation, 'annotations', injector);
  }

  public findBySample(sample: Sample): Observable<Annotation[]> {
    const options: any = {params: [{key: 'sample', value: sample.uri}]};
    return this.search('findBySample', options);
  }

  public fillAnnotation(annot: Annotation) {
    return annot.getRelation(Tag, 'tag').pipe(
      map(tag => {
        annot.tag = tag;
        return annot;
      })
    );
  }

  public updateHighlightedAnnot(annot: AnnotationHighlight[]) {
    this.highlightedAnnotations.next(annot);
  }

  public notifyNewAnnotation(annotation: Annotation) {
    this.newAnnotation.next(annotation);
  }

  public selectText(selection: TextSelection) {
    this.textSelection.next(selection);
  }

}
