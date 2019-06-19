import {Component, Input, OnInit} from '@angular/core';
import {Sample} from '../../shared/models/sample';

@Component({
  selector: 'app-sample-simple-list',
  templateUrl: './sample-simple-list.component.html',
  styleUrls: ['./sample-simple-list.component.css']
})
export class SampleSimpleListComponent implements OnInit {

  @Input()
  public samples: Sample[];

  constructor() { }

  ngOnInit() {
  }

}
