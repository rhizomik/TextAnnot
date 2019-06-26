import {AfterViewInit, Component, Input, OnInit, ViewChild} from '@angular/core';
import {AnnotationStatistic, SampleStatistics} from '../../../shared/models/sample-statistics';
import {NestedTreeControl} from '@angular/cdk/tree';
import {MatTreeNestedDataSource} from '@angular/material';

@Component({
  selector: 'app-annotation-statistics',
  templateUrl: './annotation-statistics.component.html',
  styleUrls: ['./annotation-statistics.component.css']
})
export class AnnotationStatisticsComponent implements OnInit {

  @Input() statistics: SampleStatistics;
  Math = Math;

  treeControl = new NestedTreeControl<AnnotationStatistic>(dataNode => dataNode.childrenStatistics);
  dataSource = new MatTreeNestedDataSource<AnnotationStatistic>();
  hasChild = (_: number, node: AnnotationStatistic) => !!node.childrenStatistics && node.childrenStatistics.length > 0;

  constructor() { }

  ngOnInit() {
    this.dataSource.data = this.statistics.annotationStatistics;
    this.treeControl.dataNodes = this.statistics.annotationStatistics;
    this.treeControl.expandAll();
  }
}
