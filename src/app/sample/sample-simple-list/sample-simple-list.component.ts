import {Component, Input, OnInit} from '@angular/core';
import {Sample} from '../../shared/models/sample';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {SampleDetailModalComponent} from '../sample-detail-modal/sample-detail-modal.component';

@Component({
  selector: 'app-sample-simple-list',
  templateUrl: './sample-simple-list.component.html',
  styleUrls: ['./sample-simple-list.component.css']
})
export class SampleSimpleListComponent implements OnInit {

  @Input()
  public samples: Sample[];

  constructor(private modalService: NgbModal) { }

  ngOnInit() {
  }

  openModal(sample: Sample) {
    const modalRef = this.modalService.open(SampleDetailModalComponent, {size: 'lg', centered: true});
    modalRef.componentInstance.sample = sample;
  }
}
