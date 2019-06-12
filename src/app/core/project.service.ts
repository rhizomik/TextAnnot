import {Injectable, Injector, OnInit} from "@angular/core";
import {RestService} from "angular4-hal-aot";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../../environments/environment";
import {Project} from "../shared/modal/project";


@Injectable()
export class ProjectService extends RestService<Project> implements OnInit {

  static project: Project;

  constructor(injector: Injector, private http: HttpClient) {
    super(Project, 'projects', injector);
  }

  ngOnInit(): void {
    if (!localStorage.getItem('project')) {
      this.getProjectByName(environment.defaultProject)
        .subscribe(project => {
          ProjectService.project = project;
        });
    } else {
      this.getProjectByName(localStorage.getItem('project'))
        .subscribe(project => {
          ProjectService.project = project;
        });
    }
  }

  private getProjectByName(name: string): Observable<Project> {
    const options = {params: [{key: 'name', value: name}]};
    return this.searchSingle('findByName', options);
  }
}
