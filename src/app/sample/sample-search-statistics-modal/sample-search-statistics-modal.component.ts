import {Component, Input, OnInit} from '@angular/core';
import {SampleStatistics} from '../sample-statistics';

@Component({
  selector: 'app-sample-search-statistics-modal',
  templateUrl: './sample-search-statistics-modal.component.html',
  styleUrls: ['./sample-search-statistics-modal.component.css']
})
export class SampleSearchStatisticsModalComponent implements OnInit {

  @Input()
  public statistics: SampleStatistics;

  constructor() { }

  ngOnInit() {
  }

}
