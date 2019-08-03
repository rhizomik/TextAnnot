import { Component, OnInit } from '@angular/core';
import {Project} from "../shared/models/project";
import {ProjectService} from "../core/services/project.service";
import {SampleService} from "../core/services/sample.service";
import {SampleStatistics} from "../shared/models/sample-statistics";
import {ProjectStatistics} from "../shared/models/project-statistics";

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css']
})
export class StatisticsComponent implements OnInit {

  private project: Project;
  public statistics: ProjectStatistics;
  public totalWords: number;

  constructor(
    private projectService: ProjectService,
  ) { }

  async ngOnInit() {
    this.project = await this.projectService.getProject();
    this.projectService.getProjectStatistics(this.project)
      .subscribe(statistics => this.statistics = statistics);
  }

}
