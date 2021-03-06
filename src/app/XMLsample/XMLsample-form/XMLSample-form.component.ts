import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {XMLSampleService} from '../../core/services/XMLsample.service';
import {FileItem, FileUploader} from 'ng2-file-upload';
import {environment} from '../../../environments/environment';
import {AuthenticationBasicService} from '../../core/services/authentication-basic.service';
import {ErrorMessageService} from '../../error-handler/error-message.service';
import {ProjectService} from '../../core/services/project.service';


@Component({
  selector: 'app-xml-sample-form',
  templateUrl: './XMLsample-form.component.html',
  styleUrls: ['./XMLSample-form.component.css'],
})
export class XMLSampleFormComponent implements OnInit {
  uploader: FileUploader;

  constructor(private router: Router,
              private errorMessageService: ErrorMessageService,
              private xmlSampleService: XMLSampleService,
              private authentication: AuthenticationBasicService,
              private projectService: ProjectService) {
  }

  async ngOnInit() {
    const project = await this.projectService.getProject();
    this.uploader = this.initializeUploader();
    this.uploader.onErrorItem = this.onErrorItem.bind(this);
    this.uploader.options.additionalParameter = {'project': project.uri};
  }

  initializeUploader(): FileUploader {
    return new FileUploader({
      url: `${environment.API}/upload/xmlsample`,
      authToken: this.authentication.getCurrentUser().authorization,
      autoUpload: true,
    });
  }

  onErrorItem(this, item: FileItem, response: string) {
    const errorMessage = JSON.parse(response);
    this.errorMessageService.showErrorMessage('Error in file ' + item.file.name + ': ' + errorMessage.message);
  }

  clearCompleted() {
    this.uploader.queue.filter((item: FileItem) => item.isSuccess)
      .forEach((item: FileItem) => item.remove());
  }
}
