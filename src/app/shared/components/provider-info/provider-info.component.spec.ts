import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { NgxsModule } from '@ngxs/store';

import { Address } from 'shared/models/address.model';
import { Institution } from 'shared/models/institution.model';
import { Provider } from 'shared/models/provider.model';
import { PhonePipe } from 'shared/pipes/phone.pipe';
import { ProviderInfoComponent } from './provider-info.component';

describe('ProviderInfoComponent', () => {
  let component: ProviderInfoComponent;
  let fixture: ComponentFixture<ProviderInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MatTableModule,
        RouterTestingModule,
        MatMenuModule,
        MatIconModule,
        MatFormFieldModule,
        NgxsModule.forRoot([]),
        HttpClientTestingModule,
        MatTabsModule,
        BrowserAnimationsModule,
        TranslateModule.forRoot()
      ],
      declarations: [ProviderInfoComponent, PhonePipe]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProviderInfoComponent);
    component = fixture.componentInstance;
    component.provider = {} as Provider;
    component.provider.actualAddress = {
      codeficatorAddressDto: {}
    } as Address;
    component.provider.legalAddress = {
      codeficatorAddressDto: {}
    } as Address;
    component.provider.institution = {} as Institution;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
