import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {flatMap, takeUntil} from 'rxjs/operators';
import {Annotation} from '../annotation';
import {forkJoin, Subject} from 'rxjs';
import {Sample} from '../../sample/sample';
import {AnnotationService} from '../annotation.service';
import {AnnotationHighlight} from '../annotation-highlight';
import {faFilter} from '@fortawesome/free-solid-svg-icons';
import {TagTree} from '../../tag-hierarchy/tag-hierarchy-tree';
import {KEYS, TREE_ACTIONS} from 'angular-tree-component';
import {TagHierarchyService} from '../../tag-hierarchy/tag-hierarchy.service';

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
  searchText: string;

  activeAnnotations: AnnotationHighlight[] = [];

  public tags: TagTree[];
  public options = {
    animateExpand: true,
    actionMapping: {
      mouse: {
        dblClick: (tree, node, $event) => {
          if (node.hasChildren) {
            TREE_ACTIONS.TOGGLE_EXPANDED(tree, node, $event);
          }
        }
      },
      keys: {
        [KEYS.ENTER]: (tree, node, $event) => {
          node.expandAll();
        }
      }
    },
    scrollOnActivate: true,
  };


  ngUnsubscribe = new Subject<void>();

  constructor(
    private annotationService: AnnotationService,
    private tagHierarchyService: TagHierarchyService,
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
      this.sortAnnotations();
    });

    this.tagHierarchyService.getTagHierarchyTree(this.sample.taggedBy)
      .subscribe(value => this.tags = value.roots);

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

  searchAnnot() {
    if (this.searchText.length >= 2) {
      this.filteredAnnotations = this.annotations.filter(
        value => this.sample.text.substring(value.start, value.end).includes(this.searchText));
    } else {
      this.filteredAnnotations = this.annotations;
    }
  }
}
