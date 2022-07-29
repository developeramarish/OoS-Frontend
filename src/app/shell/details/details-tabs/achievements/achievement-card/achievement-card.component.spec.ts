import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { RouterTestingModule } from '@angular/router/testing';
import { NgxsModule } from '@ngxs/store';
import { Achievement } from 'src/app/shared/models/achievement.model';
import { AchievementCardComponent } from './achievement-card.component';

describe('AchievementCardComponent', () => {
  let component: AchievementCardComponent;
  let fixture: ComponentFixture<AchievementCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        NgxsModule.forRoot([]),
        MatIconModule,
        MatCardModule,
        RouterTestingModule,
        MatDialogModule,
      ],
      declarations: [AchievementCardComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AchievementCardComponent);
    component = fixture.componentInstance;
    component.achievement = {} as Achievement;
    component.isAllowedEdit;
    component.workshop;
    component.achievementsTitle;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});