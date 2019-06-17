import { Subject } from 'rxjs/internal/Subject';
import { Injectable } from '@angular/core';
import { DomService } from './dom.service';
import { Observable } from 'rxjs';

@Injectable()
export class ModalService {

  constructor(private domService: DomService) { }

  private modalElementId = 'confirm-models-container';
  private overlayElementId = 'overlay';

  public data: any;

  public result$: Subject<boolean>;

  init(component: any, data: any): Observable<boolean> {
    this.result$ = new Subject();
    this.data = data;
    this.domService.appendComponentTo(this.modalElementId, component);
    document.getElementById(this.modalElementId).className = 'show';
    document.getElementById(this.overlayElementId).className = 'show';
    return this.result$;
  }

  destroy() {
    this.result$ = null;
    this.domService.removeComponent();
    document.getElementById(this.modalElementId).className = 'hidden';
    document.getElementById(this.overlayElementId).className = 'hidden';
  }
}
