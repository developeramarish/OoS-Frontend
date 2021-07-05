import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { SocialGroup } from 'src/app/shared/models/socialGroup.model';

@Component({
  selector: 'app-child-form',
  templateUrl: './child-form.component.html',
  styleUrls: ['./child-form.component.scss'],
})
export class ChildFormComponent implements OnInit {

  @Input() ChildFormGroup: FormGroup;
  @Input() index: number;
  @Input() childrenAmount: number;
  @Input() socialGroups: SocialGroup[];

  @Output() deleteForm = new EventEmitter();

  today: Date = new Date();

  constructor() { }

  ngOnInit(): void { }

  delete(): void {
    this.deleteForm.emit(this.index);
  }
}