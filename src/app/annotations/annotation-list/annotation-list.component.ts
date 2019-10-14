import {Component, ElementRef, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {flatMap, takeUntil} from 'rxjs/operators';
import {Annotation} from '../../shared/models/annotation';
import {forkJoin, Subject} from 'rxjs';
import {Sample} from '../../shared/models/sample';
import {AnnotationService} from '../../core/services/annotation.service';
import {AnnotationHighlight} from '../annotation-highlight';
import {faFilter} from '@fortawesome/free-solid-svg-icons';
import {AnnotationFilter} from './annotation-list-filter/annotation-filter';

@Component({
  selector: 'app-annotation-list',
  templateUrl: './annotation-list.component.html',
  styleUrls: ['./annotation-list.component.css']
})
export class AnnotationListComponent implements OnInit, OnDestroy {

  @Input() sample: Sample;
  faFilter = faFilter;
  annotations: Annotation[] = [];
  filteredAnnotations: Annotation[];
  filters: AnnotationFilter;
  activeAnnotations: AnnotationHighlight[] = [];

  ngUnsubscribe = new Subject<void>();
  showAlert = false;
  @ViewChild('confirmDelete') private confirmDeleteSpan: ElementRef;

  constructor(
    private annotationService: AnnotationService,
  ) { }

  ngOnInit() {
    this.annotationService.findBySample(this.sample).pipe(
      flatMap((annotations: Annotation[]) =>  forkJoin(annotations.map(this.annotationService.fillAnnotation))),
      takeUntil(this.ngUnsubscribe),
    ).subscribe((annotations: Annotation[]) => {
      this.annotations = annotations;
      this.filteredAnnotations = annotations;
      this.sortAnnotations();
    });

    this.annotationService.newAnnotation.subscribe(value => {
      this.annotations.push(value);
      this.filteredAnnotations = this.annotations;
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
    this.filteredAnnotations.forEach(value => {
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

  onFiltersChange(filters: AnnotationFilter) {
    this.filteredAnnotations = this.annotations;
    this.filters = filters;
    if (filters.selectedTagsIds.size !== 0) {
      this.filteredAnnotations = this.filteredAnnotations.filter(
        value => filters.selectedTagsIds.has(value.tag.id));
    }
    if (filters.searchText.length >= 2) {
      this.filteredAnnotations = this.filteredAnnotations.filter(
        value => this.sample.text.substring(value.start, value.end).includes(filters.searchText));
    }
  }

  deleteAnnotation(annotation: Annotation, event: MouseEvent) {
    event.stopPropagation();
    if (confirm(this.confirmDeleteSpan.nativeElement.textContent)) {
      this.annotationService.delete(annotation).subscribe(value => {
        this.annotations = this.annotations.filter(annot => annot.id !== annotation.id);
        this.onFiltersChange(this.filters);
        this.highlightAnnot(annotation);
        this.showAlert = true;
        setTimeout(() => this.showAlert = false, 5000);
      });
    }
  }
}
