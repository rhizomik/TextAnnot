import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
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

  @Output()
  public sampleClick: EventEmitter<Sample> = new EventEmitter();

  constructor(private modalService: NgbModal) { }

  ngOnInit() {
  }

  onSampleClicked(sample: Sample) {
    this.sampleClick.emit(sample);
  }
}
