import { AnnotationService } from './annotation.service';
import { SampleService } from '../sample/sample.service';
import { ActivatedRoute } from '@angular/router';
import {AfterViewInit, Component, HostListener, OnDestroy, OnInit, ViewChild} from '@angular/core';
import { Sample } from '../sample/sample';
import { Annotation } from './annotation';
import {flatMap, map, takeUntil} from 'rxjs/operators';
import {forkJoin, Observable, Subject} from 'rxjs';
import {TagHierarchyService} from '../tag-hierarchy/tag-hierarchy.service';
import {TagHierarchy} from '../tag-hierarchy/tag-hierarchy';
import {TagService} from '../tag/tag.service';
import {Tag} from '../tag/tag';
import {TagTree} from '../tag-hierarchy/tag-hierarchy-tree';
import {KEYS, TREE_ACTIONS} from 'angular-tree-component';
import {environment} from '../../environments/environment';
import * as $ from 'jquery';
import {faAngleDown} from '@fortawesome/free-solid-svg-icons';
import {AnnotationHighlight} from './annotation-highlight';

@Component({
  selector: 'app-annotations',
  templateUrl: './annotations.component.html',
  styleUrls: ['./annotations.component.css']
})
export class AnnotationsComponent implements OnInit, OnDestroy, AfterViewInit {
  readonly HIGHLIGHT_OPEN_TAG = '<span class="annotation">';
  readonly HIGHLIGHT_CLOSE_TAG = '</span>';
  faDown = faAngleDown;

  ngUnsubscribe = new Subject<void>();

  public sample: Sample;
  public selectedText: string;
  public annotations: Annotation[] = [];
  public tagHierarchies: TagHierarchy[];
  public selectedTagHierarchy: TagHierarchy;
  public selectedTag: TagTree;
  public currentAnnotation: Annotation;
  public submitting = false;

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

  public highlightedText: string;

  constructor(private route: ActivatedRoute,
              private samplesService: SampleService,
              private annotationService: AnnotationService,
              private tagHierarchyService: TagHierarchyService) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');

    this.samplesService.get(id).subscribe(value => {
        this.sample = value;
        this.currentAnnotation = new Annotation();
        this.currentAnnotation.sample = this.sample;
      });

    this.tagHierarchyService.getAll().subscribe(value => this.tagHierarchies = value);

    this.annotationService.highlightedAnnotations.subscribe(value => {
      this.highlightText(value);
    });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  ngAfterViewInit(): void {
    $('#success-alert').hide();
  }

  showSelectedText(event: MouseEvent) {
    if (window.getSelection) {
      this.selectedText = window.getSelection().toString();
      this.currentAnnotation.start = window.getSelection().baseOffset;
      this.currentAnnotation.end = window.getSelection().extentOffset;
    }
  }

  tagHierarchyChange(newTagHierarchy) {
    this.selectedTagHierarchy = newTagHierarchy;
    this.tagHierarchyService.getTagHierarchyTree(this.selectedTagHierarchy)
      .subscribe(value => this.tags = value.roots);
  }

  onActivate(event) {
    this.selectedTag = event.node.data;
  }

  // annotate() {
  //   this.submitting = true;
  //   // @ts-ignore
  //   this.currentAnnotation.tag = `${environment.API}/tags/${this.selectedTag.id}`;
  //   this.annotationService.create(this.currentAnnotation).pipe(
  //     flatMap((value: Annotation) => this.fillAnnotation(value))
  //   ).subscribe(value => {
  //     this.annotations.push(Object.assign({}, value));
  //     this.sortAnnotations();
  //     this.submitting = false;
  //     $('#success-alert').show().delay(300).fadeTo(2000, 500).slideUp(500, function() {
  //       $('#success-alert').slideUp(500);
  //     });
  //   }, err => this.submitting = false);
  // }

  private highlightText(highlighted: AnnotationHighlight[]) {
    let annotCount = 0;
    this.highlightedText = this.sample.text;
    highlighted.sort((a, b) => b.pos - a.pos).forEach(value => {
      if (!value['starting'] && annotCount === 0) {
        this.highlightedText =
          [this.highlightedText.slice(0, value['pos']), this.HIGHLIGHT_CLOSE_TAG,
            this.highlightedText.slice(value['pos'])].join('');
      } else if (value['starting'] && annotCount === 1) {
        this.highlightedText =
          [this.highlightedText.slice(0, value['pos']), this.HIGHLIGHT_OPEN_TAG,
            this.highlightedText.slice(value['pos'])].join('');
      }
      annotCount += value['starting'] ? -1 : 1;
    });

  }
}
