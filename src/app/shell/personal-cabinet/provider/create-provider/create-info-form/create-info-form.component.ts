import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Constants } from 'src/app/shared/constants/constants';

@Component({
  selector: 'app-create-info-form',
  templateUrl: './create-info-form.component.html',
  styleUrls: ['./create-info-form.component.scss']
})
export class CreateInfoFormComponent implements OnInit {

  readonly constants: typeof Constants = Constants;

  InfoFormGroup: FormGroup;
  @Output() passInfoFormGroup = new EventEmitter();

  constructor(private formBuilder: FormBuilder) {
    this.InfoFormGroup = this.formBuilder.group({
      fullTitle: new FormControl('', Validators.required),
      shortTitle: new FormControl('', Validators.required),
      edrpouIpn: new FormControl('', Validators.required),
      director: new FormControl('', Validators.required),
      directorBirthDay: new FormControl('', Validators.required),
      phoneNumber: new FormControl('', [Validators.required, Validators.maxLength(9), Validators.minLength(9)]),
      email: new FormControl('', [Validators.required, Validators.email]),
      website: new FormControl(''),
      facebook: new FormControl(''),
      instagram: new FormControl(''),
      founder: new FormControl('', Validators.required),
      type: new FormControl(0, Validators.required),
      ownership: new FormControl(0, Validators.required),
    });
  }

  ngOnInit(): void {
    this.passInfoFormGroup.emit(this.InfoFormGroup);
  }

}