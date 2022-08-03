import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ProviderRoutingModule } from './provider-routing.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ProviderOrgInfoComponent } from './provider-org-info/provider-org-info.component';
import { CreateAddressComponent } from './create-workshop/create-address/create-address.component';
import { CreateAboutFormComponent } from './create-workshop/create-about-form/create-about-form.component';
import { CreateDescriptionFormComponent } from './create-workshop/create-description-form/create-description-form.component';
import { CreateWorkshopComponent } from './create-workshop/create-workshop.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { GeolocationService } from 'src/app/shared/services/geolocation/geolocation.service';
import { CreateProviderComponent } from './create-provider/create-provider.component';
import { CreateInfoFormComponent } from './create-provider/create-info-form/create-info-form.component';
import { CreateContactsFormComponent } from './create-provider/create-contacts-form/create-contacts-form.component';
import { CreatePhotoFormComponent } from './create-provider/create-photo-form/create-photo-form.component';
import { CreateTeacherComponent } from './create-workshop/create-teacher/create-teacher.component';
import { TeacherFormComponent } from './create-workshop/create-teacher/teacher-form/teacher-form.component';
import { MaterialModule } from 'src/app/shared/modules/material.module';
import { CreateProviderAdminComponent } from './create-provider-admin/create-provider-admin.component';
import { CreateAchievementComponent } from './create-achievement/create-achievement.component';
import { ProviderAdminsComponent } from './provider-admins/provider-admins.component';
import { ProviderApplciationsComponent } from './provider-applciations/provider-applciations.component';
import { ProviderWorkshopsComponent } from './provider-workshops/provider-workshops.component';
import { SharedCabinetModule } from '../shared-cabinet/shared-cabinet.module';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { WorkingHoursFormWrapperComponent } from './create-workshop/create-about-form/working-hours-form-wrapper/working-hours-form-wrapper.component';
@NgModule({
  declarations: [
    ProviderOrgInfoComponent,
    CreateAddressComponent,
    CreateAboutFormComponent,
    CreateDescriptionFormComponent,
    CreateWorkshopComponent,
    CreateProviderComponent,
    CreateInfoFormComponent,
    CreateContactsFormComponent,
    CreatePhotoFormComponent,
    CreateTeacherComponent,
    TeacherFormComponent,
    CreateProviderAdminComponent,
    CreateAchievementComponent,
    ProviderAdminsComponent,
    ProviderApplciationsComponent,
    ProviderWorkshopsComponent,
    WorkingHoursFormWrapperComponent
  ],
  imports: [
    CommonModule,
    ProviderRoutingModule,
    FlexLayoutModule,
    SharedModule,
    MaterialModule,
    SharedCabinetModule,
    RouterModule,
    FormsModule,
  ],

  providers: [
    DatePipe,
    GeolocationService
  ],

})
export class ProviderModule {
}
