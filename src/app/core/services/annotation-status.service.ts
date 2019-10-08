import {Injectable, Injector} from '@angular/core';
import {RestService} from 'angular4-hal-aot';
import {AnnotationStatus} from '../../shared/models/annotation-status';
import {Project} from '../../shared/models/project';

@Injectable()
export class AnnotationStatusService extends RestService<AnnotationStatus> {

  constructor(injector: Injector) {
    super(AnnotationStatus, 'annotationStatuses', injector);
  }

  getAllByProject(project: Project) {
    const options: any = {params: [{key: 'project', value: project.uri}]};
    return this.search('findByDefinedAt', options);
  }
}
