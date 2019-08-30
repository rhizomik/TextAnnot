import { AnnotationsComponent } from './annotations/annotations.component';
import { TagsTreeCreationComponent } from './tag/tags-create/tags-tree-creation.component';
import { Routes } from '@angular/router';
import { LoggedInGuard } from './login-basic/loggedin.guard';
import { AdministratorGuard } from './login-basic/administrator.guard';

import { AboutComponent } from './about/about.component';
import { AdminListComponent } from './user/user-list/admin-list.component';
import { AdminDetailComponent } from './user/user-detail/admin-detail.component';
import { AdminCreateComponent } from './user/user-create/admin-create.component';
import { AdminEditComponent } from './user/user-edit/admin-edit.component';
import { LinguistCreateComponent } from './user/user-create/linguist-create.component';
import { LinguistEditComponent } from './user/user-edit/linguist-edit.component';
import { LinguistListComponent } from './user/user-list/linguist-list.component';
import { LinguistDetailComponent } from './user/user-detail/linguist-detail.component';
import { SampleCreateComponent } from './sample/sample-create/sample-create.component';
import { SampleListComponent } from './sample/sample-list/sample-list.component';
import { MetadataFieldListComponent } from './metadatafield/metadatafield-list/metadatafield-list.component';

import {SampleDeleteComponent} from './sample/sample-delete/sample-delete.component';
import {SampleDetailComponent} from './sample/sample-detail/sample-detail.component';
import {SampleEditComponent} from './sample/sample-edit/sample-edit.component';
import {XMLSampleFormComponent} from './XMLsample/XMLsample-form/XMLSample-form.component';

import { TagComponent } from './tag/tag.component';

import {MetadatafieldEditValuesComponent} from './metadatafield/metadatafield-edit-values/metadatafield-edit-values.component';
import {UnannotatedSamplesComponent} from './unannotated-samples/unannotated-samples.component';
import {StatisticsComponent} from './statistics/statistics.component';
import {ProfileComponent} from './profile/profile.component';

export const routes: Routes = [
  { path: '', redirectTo: 'about', pathMatch: 'full' },
  { path: 'about', component: AboutComponent },
  { path: 'admins/new', component: AdminCreateComponent, canActivate: [AdministratorGuard] },
  { path: 'admins/:id/edit', component: AdminEditComponent, canActivate: [AdministratorGuard] },
  { path: 'admins/:id', component: AdminDetailComponent, canActivate: [AdministratorGuard] },
  { path: 'admins', component: AdminListComponent, canActivate: [AdministratorGuard] },
  { path: 'linguists/new', component: LinguistCreateComponent, canActivate: [AdministratorGuard] },
  { path: 'linguists/:id/edit', component: LinguistEditComponent, canActivate: [AdministratorGuard] },
  { path: 'linguists/:id', component: LinguistDetailComponent, canActivate: [LoggedInGuard] },
  { path: 'linguists', component: LinguistListComponent, canActivate: [LoggedInGuard] },
  { path: 'samples/new', component: SampleCreateComponent, canActivate: [LoggedInGuard] },
  { path: 'samples/upload', component: XMLSampleFormComponent, canActivate: [LoggedInGuard] },
  { path: 'samples', component: SampleListComponent},
  { path: 'samples/:id/edit' , component: SampleEditComponent,  canActivate: [LoggedInGuard]},
  { path: 'samples/:id/delete', component: SampleDeleteComponent, canActivate: [LoggedInGuard] },
  { path: 'samples/:id', component: SampleDetailComponent, canActivate: [LoggedInGuard] },
  { path: 'metadataFields/:id/values', component: MetadatafieldEditValuesComponent, canActivate: [LoggedInGuard]},
  { path: 'metadataFields', component: MetadataFieldListComponent, canActivate: [AdministratorGuard] },
  { path: 'tags', component: TagComponent, canActivate: [AdministratorGuard]},
  { path: 'tags/create', component: TagsTreeCreationComponent, canActivate: [AdministratorGuard]},
  { path: 'annotations', component: UnannotatedSamplesComponent, canActivate: [LoggedInGuard]},
  { path: 'annotations/:id', component: AnnotationsComponent, canActivate: [LoggedInGuard]},
  { path: 'profile', component: ProfileComponent, canActivate: [LoggedInGuard]},
  { path: 'statistics', component: StatisticsComponent},
];
