import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {flatMap, takeUntil} from 'rxjs/operators';
import {Annotation} from '../annotation';
import {forkJoin, Subject} from 'rxjs';
import {Sample} from '../../sample/sample';
import {AnnotationService} from '../annotation.service';
import {AnnotationHighlight} from '../annotation-highlight';
import {faAngleDown, faAngleRight, faFilter} from '@fortawesome/free-solid-svg-icons';
import {TagTreeNode} from '../../tag-hierarchy/tag-hierarchy-tree';
import {KEYS, TREE_ACTIONS} from 'angular-tree-component';
import {TagHierarchyService} from '../../tag-hierarchy/tag-hierarchy.service';
import {nodeChildrenAsMap} from '@angular/router/src/utils/tree';
import {NestedTreeControl} from '@angular/cdk/tree';
import {MatTreeNestedDataSource} from '@angular/material';
import {SelectionModel} from '@angular/cdk/collections';
import {Tag} from '../../tag/tag';

@Component({
  selector: 'app-annotation-list',
  templateUrl: './annotation-list.component.html',
  styleUrls: ['./annotation-list.component.css']
})
export class AnnotationListComponent implements OnInit, OnDestroy {

  @Input() sample: Sample;
  faFilter = faFilter;
  faAngleDown = faAngleDown;
  faAngleRight = faAngleRight;
  annotations: Annotation[] = [];
  filteredAnnotations: Annotation[];
  searchText = '';
  selectedTagsIds = new Set<number>();

  activeAnnotations: AnnotationHighlight[] = [];

  public tags: TagTreeNode[];
  public options = {
    animateExpand: true,
    useCheckbox: true,
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

  treeControl = new NestedTreeControl<TagTreeNode>(dataNode => dataNode.children);
  dataSource = new MatTreeNestedDataSource<TagTreeNode>();
  checklist = new SelectionModel<TagTreeNode>(true);


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
      .subscribe(value => {
        this.tags = value.roots;
        this.dataSource.data = this.tags;
      });

  }

  hasChild = (_: number, node: TagTreeNode) => !!node.children && node.children.length > 0;

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

  selectNode(node: TagTreeNode) {
    this.checklist.toggle(node);
    if (this.checklist.isSelected(node)) {
      this.selectedTagsIds.add(node.id);
    } else {
      this.selectedTagsIds.delete(node.id);
    }
    this.applyFilters();
  }

  applyFilters() {
    this.filteredAnnotations = this.annotations;
    if (this.selectedTagsIds.size !== 0) {
      this.filteredAnnotations = this.filteredAnnotations.filter(
        value => this.selectedTagsIds.has(value.tag.id));
    }
    if (this.searchText.length >= 2) {
      this.filteredAnnotations = this.filteredAnnotations.filter(
        value => this.sample.text.substring(value.start, value.end).includes(this.searchText));
    }
  }

  // checkAllParentsSelection(node: TagTreeNode): void {
  //   let parent: TagTreeNode | null = this.getParentNode(node);
  //   while (parent) {
  //     this.checkRootNodeSelection(parent);
  //     parent = this.getParentNode(parent);
  //   }
  // }
}
