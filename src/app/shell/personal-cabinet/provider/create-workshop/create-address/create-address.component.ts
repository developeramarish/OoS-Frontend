import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-create-address',
  templateUrl: './create-address.component.html',
  styleUrls: ['./create-address.component.scss']
})
export class CreateAddressComponent implements OnInit {

  AddressFormGroup: FormGroup;

  @Output() passAddressFormGroup = new EventEmitter();


  constructor(
    private formBuilder: FormBuilder) {

    this.AddressFormGroup = this.formBuilder.group({
      street: new FormControl('', Validators.required),
      buildingNumber: new FormControl('', Validators.required),
      city: new FormControl('', Validators.required)
    });
  }

  ngOnInit(): void {
    this.passAddressFormGroup.emit(this.AddressFormGroup);
  }

  onReceiveAddressFromMap(form): void {
    this.AddressFormGroup.get('city').setValue(form.city);
    this.AddressFormGroup.get('buildingNumber').setValue(form.buildingNumber);
    this.AddressFormGroup.get('street').setValue(form.street);
  }
}