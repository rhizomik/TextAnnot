import {Component, Input, OnInit} from '@angular/core';
import {FilteredSample, Sample} from '../../shared/models/sample';
import {SampleDetailModalComponent} from '../sample-detail-modal/sample-detail-modal.component';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-sample-word-list',
  templateUrl: './sample-word-list.component.html',
  styleUrls: ['./sample-word-list.component.css']
})
export class SampleWordListComponent implements OnInit {

  @Input()
  public samples: FilteredSample[];

  constructor(private modalService: NgbModal) { }

  ngOnInit() {
  }

  openModal(sample: FilteredSample) {
    const modalRef = this.modalService.open(SampleDetailModalComponent, {size: 'lg', centered: true});
    modalRef.componentInstance.sample = sample;
  }
}
