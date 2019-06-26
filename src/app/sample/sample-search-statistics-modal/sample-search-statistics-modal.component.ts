import {AfterViewInit, Component, Input, OnInit, ViewChild} from '@angular/core';
import {AnnotationStatistic, SampleStatistics} from '../../shared/models/sample-statistics';
import {AuthenticationBasicService} from '../../login-basic/authentication-basic.service';
import {Router} from '@angular/router';
import {MetadataFieldService} from '../../core/services/metadata-field.service';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {NestedTreeControl, TreeControl} from '@angular/cdk/tree';
import {MatTreeNestedDataSource} from '@angular/material';

@Component({
  selector: 'app-sample-search-statistics-modal',
  templateUrl: './sample-search-statistics-modal.component.html',
  styleUrls: ['./sample-search-statistics-modal.component.css']
})
export class SampleSearchStatisticsModalComponent implements OnInit, AfterViewInit {
  Arr = Array;

  @Input()
  public statistics: SampleStatistics;

  treeControl = new NestedTreeControl<AnnotationStatistic>(dataNode => dataNode.childrenStatistics);
  dataSource = new MatTreeNestedDataSource<AnnotationStatistic>();
  hasChild = (_: number, node: AnnotationStatistic) => !!node.childrenStatistics && node.childrenStatistics.length > 0;

  @ViewChild('tree') tree;

  constructor(
    private authentication: AuthenticationBasicService,
    private router: Router,
    private metadataFieldService: MetadataFieldService,
    private activeModal: NgbActiveModal
  ) {
  }

  ngOnInit() {
    this.dataSource.data = this.statistics.annotationStatistics;
  }

  navigateFieldValues(metadataFieldName: string) {
    this.metadataFieldService.getMetadataFieldsByName(metadataFieldName)
      .subscribe(value => {
        this.activeModal.dismiss();
        this.router.navigate(['metadataFields', value.id, 'values']);
      });
  }

  ngAfterViewInit(): void {
    // this.tree.treeControl.expandAll();
  }
}
