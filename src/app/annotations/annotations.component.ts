import { AnnotationService } from './annotation.service';
import { SampleService } from '../sample/sample.service';
import { ActivatedRoute } from '@angular/router';
import {Component, HostListener, OnDestroy, OnInit, ViewChild} from '@angular/core';
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
  public tagHierarchies: TagHierarchy[];
  public selectedTagHierarchy: TagHierarchy;
  public selectedTag: TagTree;
  public currentAnnotation: Annotation;

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
              private tagHierarchyService: TagHierarchyService,
              private tagService: TagService) { }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');

    this.samplesService.get(id).pipe(
      flatMap(res => {
        this.sample = res;
        this.currentAnnotation = new Annotation();
        this.currentAnnotation.sample = this.sample;
        return this.annotationService.findBySample(this.sample);
      }),
      flatMap((annotations: Annotation[]) =>  forkJoin(annotations.map(this.fillAnnotation))),
      takeUntil(this.ngUnsubscribe),
    ).subscribe((annotations: Annotation[]) => this.annotations = annotations);

    this.tagHierarchyService.getAll().subscribe(value => this.tagHierarchies = value);
  }

  private fillAnnotation(annot: Annotation) {
    return annot.getRelation(Tag, 'tag').pipe(
      map(tag => {
        annot.tag = tag;
        return annot;
      })
    );
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  showSelectedText(event: MouseEvent) {
    if (window.getSelection) {
      this.selectedText = window.getSelection().toString();
      this.currentAnnotation.start = window.getSelection().baseOffset - 1;
      this.currentAnnotation.end = window.getSelection().extentOffset - 1;
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

  annotate() {
    // @ts-ignore
    this.currentAnnotation.tag = `${environment.API}/tags/${this.selectedTag.id}`;
    this.annotationService.create(this.currentAnnotation).subscribe();
  }

  highlightAnnot(annotation: Annotation) {
    // @ts-ignore TODO: arreglar
    if (!annotation.active) {
      // @ts-ignore
      this.annotations.map(value => value.active = false);
      this.highlightedText = this.sample.text.substring(0, annotation.start) +
        '<span class="error">' +
        this.sample.text.substring(annotation.start, annotation.end) +
        '</span>' +
        this.sample.text.substring(annotation.end);
    } else {
      this.highlightedText = null;
    }
    // @ts-ignore
    annotation.active = ! annotation.active;
  }
}
