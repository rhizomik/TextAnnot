import {AnnotationService} from '../core/services/annotation.service';
import {SampleService} from '../core/services/sample.service';
import {ActivatedRoute} from '@angular/router';
import {Component, OnDestroy, OnInit} from '@angular/core';
import {Sample} from '../shared/models/sample';
import {Annotation} from '../shared/models/annotation';
import {Subject} from 'rxjs';
import {AnnotationHighlight} from './annotation-highlight';
import {TextSelection} from '../shared/models/text-selection';
import {TagsEditModalComponent} from '../tag/tags-edit-modal/tags-edit-modal.component';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {MetadataModalComponent} from '../metadatafield/metadata-modal/metadata-modal.component';
import {AnnotationStatusService} from '../core/services/annotation-status.service';
import {Project} from '../shared/models/project';
import {ProjectService} from '../core/services/project.service';
import {AnnotationStatus} from '../shared/models/annotation-status';
import {flatMap} from 'rxjs/operators';

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
  private project: Project;
  public allAnnotationStatuses: AnnotationStatus[];
  public filteredStatuses: AnnotationStatus[];
  public selectedAnnotationStatus: AnnotationStatus;
  public sampleStatuses: AnnotationStatus[] = [];

  public highlightedText: string;

  constructor(private route: ActivatedRoute,
              private samplesService: SampleService,
              private annotationService: AnnotationService,
              private ngModal: NgbModal,
              private projectService: ProjectService,
              private annotationStatusService: AnnotationStatusService
              ) {}

  async ngOnInit() {
    this.project = await this.projectService.getProject();
    const id = this.route.snapshot.paramMap.get('id');
    this.samplesService.get(id).pipe(
      flatMap(sample => {
        this.sample = sample;
        return this.sample.getRelationArray(AnnotationStatus, 'annotationStatuses');
      })
    ).subscribe(statuses => this.sampleStatuses = statuses);
    this.annotationService.highlightedAnnotations.subscribe(value => this.highlightText(value));
    this.annotationStatusService.getAllByProject(this.project)
      .subscribe(value => {
        this.allAnnotationStatuses = value;
        this.filteredStatuses = value;
      });
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

  openMetadataModal() {
    const modalRef = this.ngModal.open(MetadataModalComponent, {size: 'lg', centered: true});
    modalRef.componentInstance.sample = this.sample;
  }

  filterAnnotStatuses(event: KeyboardEvent) {
    this.filteredStatuses = this.allAnnotationStatuses.filter(value =>
      value.name.toLowerCase().includes((event.target as HTMLInputElement).value.toLowerCase())
    );
  }

  addAnnotStatus() {
    this.sample.updateRelation('annotationStatuses', this.selectedAnnotationStatus).subscribe(value => {
      this.sampleStatuses.push(this.selectedAnnotationStatus);
    });
  }

  deleteAnnotationStatus(i: number) {
    this.sample.deleteRelation('annotationStatuses', this.sampleStatuses[i]).subscribe(value => {
      this.sampleStatuses.splice(i, 1);
    });
  }

  escape(html: string): string {
    return html && html
      .replace(/<p>/g, '&lt;p&gt;')
      .replace(/<\/p>/g, '&lt;/p&gt;');
  }
}
