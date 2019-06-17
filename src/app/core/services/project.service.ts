import {Injectable, Injector, OnInit} from "@angular/core";
import {RestService} from "angular4-hal-aot";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../../../environments/environment";
import {Project} from "../../shared/models/project";


@Injectable()
export class ProjectService extends RestService<Project> {

  public project: Project;

  constructor(injector: Injector, private http: HttpClient) {
    super(Project, 'projects', injector);
  }

  async getProject(): Promise<Project> {
    if (this.project) {
      return this.project;
    }
    if (!localStorage.getItem('project')) {
      this.project = await this.getProjectByName(environment.defaultProject).toPromise();
    } else {
      this.project = await this.getProjectByName(localStorage.getItem('project')).toPromise();
    }
    return this.project;
  }

  private getProjectByName(name: string): Observable<Project> {
    const options = {params: [{key: 'name', value: name}]};
    return this.searchSingle('findByName', options);
  }
}
