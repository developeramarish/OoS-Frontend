import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RejectModalWindowComponent } from './reject-modal-window.component';
import { FormControl, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Component, Input } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


describe('RejectModalWindowComponent', () => {
  let component: RejectModalWindowComponent;
  let fixture: ComponentFixture<RejectModalWindowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        FormsModule,
        ReactiveFormsModule,
        MatDialogModule,
        MatFormFieldModule,
        MatInputModule,
        BrowserAnimationsModule
      ],
      declarations: [ 
        RejectModalWindowComponent,
        MockValidationHintForInputComponent
       ],
      providers: [
        {provide: MatDialogRef, close: (dialogResult: any) => { }},
        {provide: MatDialog, useValue: {}}
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RejectModalWindowComponent);
    component = fixture.componentInstance;
    component.ReasonFormControl= new FormControl({value: 'Reason', disabled: true}, Validators.required)
    component.modalTitle = '';
    component.modalDescription = '';
    fixture.detectChanges();
  });

  it("renders without crashing", () => {
    global.scrollTo = jest.fn()
  })

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

@Component({
  selector: 'app-validation-hint-for-input',
  template: ''
})

class MockValidationHintForInputComponent {
  @Input() type: string;
  @Input() invalid: boolean;
  @Input() isEmailCheck: boolean;
  @Input() isEmptyCheck: boolean;
  @Input() minLength: boolean;
  @Input() minCharachters: number;
  @Input() forbiddenCharacter: string;
}