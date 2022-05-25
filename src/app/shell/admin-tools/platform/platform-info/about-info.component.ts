import { PlatformInfoType } from 'src/app/shared/enum/platform';
import { Select } from '@ngxs/store';
import { Component } from '@angular/core';
import { CompanyInformation } from 'src/app/shared/models/сompanyInformation.model';
import { AdminState } from 'src/app/shared/store/admin.state';
import { Observable } from 'rxjs';
@Component({
  selector: 'app-about-info',
  template: '<app-info-card [type]="aboutPortal" [platformInfo]="AboutPortal$ | async"></app-info-card>',
})
export class AboutInfoComponent {
  readonly aboutPortal = PlatformInfoType.AboutPortal;

  @Select(AdminState.AboutPortal)
  AboutPortal$: Observable<CompanyInformation>;

  constructor() { }
}