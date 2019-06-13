import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { XMLSampleService } from '../XMLsample.service';
import { FileItem, FileUploader } from 'ng2-file-upload';
import { environment} from '../../../environments/environment';
import { AuthenticationBasicService } from '../../login-basic/authentication-basic.service';
import { MetadataTemplateService } from '../../metadata-template/metadata-template.service';
import { MetadataTemplate } from '../../metadata-template/metadata-template';
import { ErrorMessageService } from '../../error-handler/error-message.service';
import {ProjectService} from "../../core/project.service";


@Component({
  selector: 'app-xml-sample-form',
  templateUrl: './XMLsample-form.component.html',
  styleUrls: ['./XMLSample-form.component.css'],
})
export class XMLSampleFormComponent implements OnInit {
  uploader: FileUploader;
  metadataTemplates: MetadataTemplate[];

  constructor(private router: Router,
              private errorMessageService: ErrorMessageService,
              private xmlSampleService: XMLSampleService,
              private authentication: AuthenticationBasicService,
              private projectService: ProjectService) { }

  async ngOnInit() {
    this.uploader = this.initializeUploader();
    this.uploader.onErrorItem = this.onErrorItem.bind(this);
    const project = await this.projectService.getProject();
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
