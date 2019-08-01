import {AnnotationService} from '../core/services/annotation.service';
import {SampleService} from '../core/services/sample.service';
import {ActivatedRoute} from '@angular/router';
import {Component, OnDestroy, OnInit} from '@angular/core';
import {Sample} from '../shared/models/sample';
import {Annotation} from '../shared/models/annotation';
import {Subject} from 'rxjs';
import {AnnotationHighlight} from './annotation-highlight';
import {TextSelection} from '../shared/models/text-selection';

@Component({
  selector: 'app-annotations',
  templateUrl: './annotations.component.html',
  styleUrls: ['./annotations.component.css']
})
export class AnnotationsComponent implements OnInit, OnDestroy {
  readonly HIGHLIGHT_OPEN_TAG = '<span class="annotation" data-toggle="tooltip" title="Hola">';
  readonly HIGHLIGHT_CLOSE_TAG = '</span>';

  ngUnsubscribe = new Subject<void>();

  public sample: Sample;
  public annotations: Annotation[] = [];

  public highlightedText: string;

  constructor(private route: ActivatedRoute,
              private samplesService: SampleService,
              private annotationService: AnnotationService,
              ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    this.samplesService.get(id).subscribe(sample => this.sample = sample);
    this.annotationService.highlightedAnnotations.subscribe(value => this.highlightText(value));
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  showSelectedText(event: MouseEvent) {
    if (window.getSelection) {
      this.annotationService.selectText(new TextSelection({
        text: window.getSelection().toString(),
        start: Math.min(window.getSelection().anchorOffset, window.getSelection().focusOffset),
        end: Math.max(window.getSelection().anchorOffset, window.getSelection().focusOffset),
      }));
    }
  }

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
