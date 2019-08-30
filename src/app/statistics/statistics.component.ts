import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Project} from '../shared/models/project';
import {ProjectService} from '../core/services/project.service';
import {ProjectMetadataStatistics, ProjectStatistics} from '../shared/models/project-statistics';
import {AuthenticationBasicService} from '../core/services/authentication-basic.service';
import {MetadataStatistics} from '../shared/models/sample-statistics';
import {ExportToCsv} from 'export-to-csv';
import {MetadataFieldService} from '../core/services/metadata-field.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css']
})
export class StatisticsComponent implements OnInit {

  private project: Project;
  public statistics: ProjectStatistics;

  @ViewChild('statistic') private statistic: ElementRef;
  @ViewChild('count') private count: ElementRef;

  constructor(
    private projectService: ProjectService,
    private authentication: AuthenticationBasicService,
    private metadataFieldService: MetadataFieldService,
    private router: Router
  ) { }

  async ngOnInit() {
    this.project = await this.projectService.getProject();
    this.projectService.getProjectStatistics(this.project)
      .subscribe(statistics => this.statistics = statistics);
  }

  navigateFieldValues(metadataFieldName: string) {
    this.metadataFieldService.getMetadataFieldsByName(metadataFieldName)
      .subscribe(value => {
        this.router.navigate(['metadataFields', value.id, 'values']);
      });
  }

  downloadStatistics(fieldStatistics: ProjectMetadataStatistics) {
    const options = {
      fieldSeparator: ';',
      filename: 'export',
      quoteStrings: '"',
      decimalSeparator: '.',
      showLabels: true,
      showTitle: true,
      title: fieldStatistics.metadataField,
      useTextFile: false,
      useBom: true,
      useKeysAsHeaders: false,
      headers: [this.statistic.nativeElement.textContent, this.count.nativeElement.textContent]
    };
    const exporter = new ExportToCsv(options);
    exporter.generateCsv(fieldStatistics.statistics);
  }

}
