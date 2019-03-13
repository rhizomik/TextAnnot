import {AfterViewInit, Component, Input, OnInit} from '@angular/core';
import {faAngleDown} from '@fortawesome/free-solid-svg-icons';
import {TagHierarchy} from '../../tag-hierarchy/tag-hierarchy';
import {TagTreeNode} from '../../tag-hierarchy/tag-hierarchy-tree';
import {Annotation} from '../annotation';
import {Sample} from '../../sample/sample';
import {TagHierarchyService} from '../../tag-hierarchy/tag-hierarchy.service';
import {environment} from '../../../environments/environment';
import {flatMap} from 'rxjs/operators';
import {AnnotationHighlight} from '../annotation-highlight';
import {AnnotationService} from '../annotation.service';
import * as $ from 'jquery';
import {v} from '@angular/core/src/render3';
import {KEYS, TREE_ACTIONS} from 'angular-tree-component';

@Component({
  selector: 'app-annotation-new',
  templateUrl: './annotation-new.component.html',
  styleUrls: ['./annotation-new.component.css']
})
export class AnnotationNewComponent implements OnInit, AfterViewInit {

  @Input() sample: Sample;

  faDown = faAngleDown;
  public submitting = false;
  public tagHierarchies: TagHierarchy[];
  public selectedTag: TagTreeNode;
  public currentAnnotation: Annotation;
  public selectedText: string;

  public tags: TagTreeNode[];
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

  constructor(
    private tagHierarchyService: TagHierarchyService,
    private annotationService: AnnotationService,
  ) { }

  ngOnInit() {
    this.currentAnnotation = new Annotation();
    this.currentAnnotation.sample = this.sample;
    this.annotationService.textSelection.subscribe(value => {
      this.selectedText = value.text;
      this.currentAnnotation.start = value.start - 1;
      this.currentAnnotation.end = value.end + 1;
    });
    this.sample.getRelation(TagHierarchy, 'taggedBy').subscribe(
      hierarchy => {
        this.sample.taggedBy = hierarchy;
        this.tagHierarchyService.getTagHierarchyTree(this.sample.taggedBy)
          .subscribe(value => this.tags = value.roots);
      },
      () => {
        this.sample.taggedBy = null;
        this.tagHierarchyService.getAll().subscribe(value => this.tagHierarchies = value);
      });
  }

  tagHierarchyChange(newTagHierarchy) {
    this.sample.taggedBy = newTagHierarchy;
    this.tagHierarchyService.getTagHierarchyTree(this.sample.taggedBy)
      .subscribe(value => this.tags = value.roots);
  }

  onActivate(event) {
    this.selectedTag = event.node.data;
  }

  ngAfterViewInit(): void {
    $('#success-alert').hide();
  }

  annotate() {
    this.submitting = true;
    // @ts-ignore
    this.currentAnnotation.tag = `${environment.API}/tags/${this.selectedTag.id}`;
    this.annotationService.create(this.currentAnnotation).pipe(
      flatMap((value: Annotation) => this.annotationService.fillAnnotation(value))
    ).subscribe(value => {
      this.annotationService.notifyNewAnnotation(value);
      this.submitting = false;
      this.currentAnnotation = new Annotation();
      this.currentAnnotation.sample = this.sample;
      $('#success-alert').show().delay(300).fadeTo(2000, 500).slideUp(500, function() {
        $('#success-alert').slideUp(500);
      });
    }, () => this.submitting = false);
  }

}
