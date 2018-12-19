import { TagHierarchyQuickCreationComponent } from './tag-hierarchy/tag-hierarchy-quick-creation/tag-hierarchy-quick-creation.component';
import { TagService } from './tag/tag.service';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { routes } from './app.routing';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { TreeModule } from 'angular-tree-component';
import { FileUploadModule } from 'ng2-file-upload';

import { AngularHalModule } from 'angular4-hal-aot';
import { ExternalConfigurationService } from './external-configuration-service';

import { ErrorHandlerModule } from './error-handler/error-handler.module';
import { HttpErrorInterceptor } from './error-handler/http-error-interceptor';

import { LoginBasicModule } from './login-basic/login-basic.module';
import { AuthenticationBasicService } from './login-basic/authentication-basic.service';
import { LoggedInGuard } from './login-basic/loggedin.guard';
import { AdministratorGuard } from './login-basic/administrator.guard';
import { AuthInterceptor } from './login-basic/auth-interceptor';

import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { AboutComponent } from './about/about.component';

import { AdminListComponent } from './user/user-list/admin-list.component';
import { AdminDetailComponent } from './user/user-detail/admin-detail.component';
import { AdminService } from './user/admin.service';
import { AdminCreateComponent } from './user/user-create/admin-create.component';
import { AdminEditComponent } from './user/user-edit/admin-edit.component';
import { AdminSearchComponent } from './user/user-search/admin-search.component';

import { LinguistListComponent } from './user/user-list/linguist-list.component';
import { LinguistDetailComponent } from './user/user-detail/linguist-detail.component';
import { LinguistCreateComponent } from './user/user-create/linguist-create.component';
import { LinguistEditComponent } from './user/user-edit/linguist-edit.component';
import { LinguistSearchComponent } from './user/user-search/linguist-search.component';
import { LinguistService } from './user/linguist.service';

import { SampleCreateComponent } from './sample/sample-create/sample-create.component';
import { SampleListComponent } from './sample/sample-list/sample-list.component';
import { SampleService } from './sample/sample.service';
import { SampleSearchComponent } from './sample/sample-search/sample-search.component';
import { SampleDeleteComponent } from './sample/sample-delete/sample-delete.component';
import { SampleDetailComponent } from './sample/sample-detail/sample-detail.component';
import { SampleEditComponent } from './sample/sample-edit/sample-edit.component';

import { MetadataValueService} from './metadataValue/metadataValue.service';
import { MetadataValueListComponent} from './metadataValue/metadata-value-list/metadata-value-list.component';
import { MetadataValueDetailComponent } from './metadataValue/metadata-value-detail/metadata-value-detail.component';
import { MetadataValueSearchComponent } from './metadataValue/metadata-value-search/metadata-value-search.component';
import { MetadataValueCreateComponent } from './metadataValue/metadata-value-create/metadata-value-create.component';
import { MetadataValueEditComponent } from './metadataValue/metadata-value-edit/metadata-value-edit.component';

import { MetadataTemplateService } from './metadata-template/metadata-template.service';
import { MetadataTemplateFormComponent } from './metadata-template/metadata-template-form/metadata-template-form.component';
import { MetadataTemplateListComponent } from './metadata-template/metadata-template-list/metadata-template-list.component';
import { MetadataTemplateDetailComponent } from './metadata-template/metadata-template-detail/metadata-template-detail.component';
import { TemplateSearchComponent } from './metadata-template/metadata-template-search/template-search.component';

import { XMLSampleService } from './XMLsample/XMLsample.service';
import { XMLSampleFormComponent} from './XMLsample/XMLsample-form/XMLSample-form.component';

import { MetadatafieldService } from './metadatafield/metadatafield.service';
import { MetadataFieldListComponent } from './metadatafield/metadatafield-list/metadatafield-list.component';
import { MetadafieldCreateComponent } from './metadatafield/metadatafield-create/metadafield-create.component';
import { MetadatafieldSearchComponent } from './metadatafield/metadatafield-search/metadatafield-search.component';
import { MetadatafieldEditComponent } from './metadatafield/metadatafield-edit/metadatafield-edit.component';
import { MetadatafieldDetailComponent } from './metadatafield/metadatafield-detail/metadatafield-detail.component';
import {SampleFieldsFormComponent} from './sample/sample-fields-form/sample-fields-form.component';
import { MetadatafieldInputComponent } from './metadatafield/metadatafield-input/metadatafield-input.component';

import { TagComponent } from './tag/tag.component';
import { TagFormComponent } from './tag/tag-form/tag-form.component';
import { TagListComponent } from './tag/tag-list/tag-list.component';
import { TagSearchComponent } from './tag/tag-search/tag-search.component';
import { TagEditComponent } from './tag/tag-edit/tag-edit.component';
import { TagDetailComponent } from './tag/tag-detail/tag-detail.component';

import { TagHierarchyComponent } from './tag-hierarchy/tag-hierarchy.component';
import { TagHierarchyFormComponent } from './tag-hierarchy/tag-hierarchy-form/tag-hierarchy-form.component';
import { TagHierarchyListComponent } from './tag-hierarchy/tag-hierarchy-list/tag-hierarchy-list.component';
import { TagHierarchySearchComponent } from './tag-hierarchy/tag-hierarchy-search/tag-hierarchy-search.component';
import { TagHierarchyService } from './tag-hierarchy/tag-hierarchy.service';
import { TagHierarchyEditComponent } from './tag-hierarchy/tag-hierarchy-edit/tag-hierarchy-edit.component';
import { TagHierarchyDetailComponent } from './tag-hierarchy/tag-hierarchy-detail/tag-hierarchy-detail.component';

import { BreadcrumbComponent } from './breadcrumb/breadcrumb.component';

import { SharedModule } from './shared/shared.module';
import { AnnotationsComponent } from './annotations/annotations.component';
import { AnnotationService } from './annotations/annotation.service';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    AboutComponent,
    AdminListComponent,
    AdminDetailComponent,
    AdminCreateComponent,
    AdminEditComponent,
    AdminSearchComponent,
    LinguistListComponent,
    LinguistDetailComponent,
    LinguistCreateComponent,
    LinguistEditComponent,
    LinguistSearchComponent,
    SampleCreateComponent,
    SampleSearchComponent,
    SampleListComponent,
    SampleDeleteComponent,
    SampleDetailComponent,
    SampleEditComponent,
    XMLSampleFormComponent,
    MetadataFieldListComponent,
    MetadafieldCreateComponent,
    MetadatafieldSearchComponent,
    MetadatafieldEditComponent,
    MetadatafieldDetailComponent,
    SampleSearchComponent,
    MetadataValueListComponent,
    MetadataValueDetailComponent,
    MetadataValueSearchComponent,
    MetadataTemplateFormComponent,
    MetadataTemplateListComponent,
    MetadataTemplateDetailComponent,
    TemplateSearchComponent,
    MetadataValueCreateComponent,
    MetadataValueEditComponent,
    TagComponent,
    TagFormComponent,
    TagListComponent,
    TagSearchComponent,
    TagHierarchyComponent,
    TagHierarchyFormComponent,
    TagHierarchyListComponent,
    TagHierarchySearchComponent,
    TagHierarchyEditComponent,
    TagHierarchyDetailComponent,
    TagHierarchyQuickCreationComponent,
    BreadcrumbComponent,
    TagEditComponent,
    SampleFieldsFormComponent,
    MetadatafieldInputComponent,
    TagDetailComponent,
    AnnotationsComponent,
  ],
  imports: [
    SharedModule,
    BrowserModule,
    FormsModule,
    HttpClientModule,
    RouterModule.forRoot(routes),
    NgbModule.forRoot(),
    LoginBasicModule,
    AngularHalModule.forRoot(),
    ErrorHandlerModule,
    FileUploadModule,
    ServiceWorkerModule.register('/ngsw-worker.js', {enabled: environment.production}),
    TreeModule.forRoot(),
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: HttpErrorInterceptor, multi: true },
    { provide: 'ExternalConfigurationService', useClass: ExternalConfigurationService },
    AuthenticationBasicService, LoggedInGuard, AdministratorGuard, AdminService, LinguistService, SampleService,
    XMLSampleService, AnnotationService, MetadataValueService, MetadataTemplateService, MetadatafieldService,
    TagHierarchyService, TagService],
  bootstrap: [AppComponent]
})
export class AppModule { }
