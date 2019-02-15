import { Annotation } from './annotation';
import { HttpClient } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { RestService } from 'angular4-hal-aot';
import { Observable } from 'rxjs/internal/Observable';
import { Sample } from '../sample/sample';
import {BehaviorSubject, Subject} from 'rxjs';
import {AnnotationHighlight} from './annotation-highlight';

@Injectable()
export class AnnotationService extends RestService<Annotation> {

  highlightedAnnotations = new Subject<AnnotationHighlight[]>();

  constructor(injector: Injector, private http: HttpClient) {
    super(Annotation, 'annotations', injector);
  }

  public findBySample(sample: Sample): Observable<Annotation[]> {
    const options: any = {params: [{key: 'sample', value: sample.uri}]};
    return this.search('findBySample', options);
  }

  public updateHighlightedAnnot(annot: AnnotationHighlight[]){
    this.highlightedAnnotations.next(annot);
  }



}
