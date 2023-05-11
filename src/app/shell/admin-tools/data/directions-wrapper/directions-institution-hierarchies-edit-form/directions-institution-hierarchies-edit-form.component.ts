import { Component, OnInit, Inject, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatOption } from '@angular/material/core';
import { MatSelect } from '@angular/material/select';
import { Router } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { Observable, forkJoin } from 'rxjs';
import { InstituitionHierarchy } from '../../../../../shared/models/institution.model';
import { InstitutionsService } from '../../../../../shared/services/institutions/institutions.service';
import { GetAllInstitutionsHierarchy, GetDirections } from '../../../../../shared/store/meta-data.actions';
import { MetaDataState } from '../../../../../shared/store/meta-data.state';
import { Direction } from '../../../../../shared/models/category.model';
import { DataItem } from '../../../../../shared/models/item.model';


@Component({
  selector: 'app-directions-institution-hierarchies-edit-form',
  templateUrl: './directions-institution-hierarchies-edit-form.component.html',
  styleUrls: ['./directions-institution-hierarchies-edit-form.component.scss']
})
export class DirectionsInstitutionHierarchiesEditFormComponent implements OnInit, AfterViewInit {
  @ViewChild('editForm') editForm: ElementRef;
  @ViewChild('select') select: MatSelect;

  @Select(MetaDataState.directions) directions$: Observable<Direction[]>;

  editFormTitle: string = 'Редагувати напрямок';
  editFormSubtitle: string = 'Редагуйте новий напрямок';
  ministryLabel: string = 'Підпорядкування (Міністерство)';
  warningMsg: string = 'Зверніть увагу, що після зміни назви напрямку для всіх \n' +
    'інших залежних профілів також поміняється назва. ';
  userDirectionsLabel: string = 'Напрямки для користувача';

  EditDirectionFormGroup: FormGroup;
  directionsControl: FormControl = new FormControl([]);
  directions: Direction[];
  lastInsHierarchy: InstituitionHierarchy;
  fields: string[] = [];
  editedInsHierarchies: InstituitionHierarchy[] = [];

  constructor(private formBuilder: FormBuilder, private router: Router, private institutionService: InstitutionsService,
    private dialogRef: MatDialogRef<DirectionsInstitutionHierarchiesEditFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private store: Store) {
    this.store.dispatch(new GetDirections());
    this.lastInsHierarchy = this.getLastInsHierarchy();
    this.buildForm();
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      if (this.editForm) {
        this.lastInputFocus();
      }
    }, 0);
  }

  buildForm() {
    let directions = [...this.lastInsHierarchy.directions];
    const formGroupFields = this.getFormControlsFields();
    formGroupFields[this.userDirectionsLabel] = new FormControl(directions);
    this.EditDirectionFormGroup = new FormGroup(formGroupFields);
    this.directionsControl = this.EditDirectionFormGroup.get(this.userDirectionsLabel) as FormControl;
  }

  getDirections() {
    let lastInsHierarchy = this.data.element.insHierarchies[this.data.element.insHierarchies.length - 1];
    return lastInsHierarchy.directions;
  }

  getLastInsHierarchy() {
    return this.data.element.insHierarchies[this.data.element.insHierarchies.length - 1];
  }

  getFormControlsFields() {
    const formGroupFields = {};
    formGroupFields[this.ministryLabel] = new FormControl({value: this.data.element.insHierarchies[0].institution.title, disabled: true});
    this.fields.push(this.ministryLabel);
    let field, title;
    for (let i = 0; i < this.data.columns.length; ++i) {
      field = this.data.columns[i];
      title = this.data.element.insHierarchies[i]?.title;
      if (title) {
        formGroupFields[field] = new FormControl(title);
      }
      else {
        formGroupFields[field] = new FormControl({value: null, disabled: true});
      }
      this.fields.push(field);
    }
    return formGroupFields;
  }

  onCancel() {
    this.closeDialog();
  }

  onSubmit() {
    for (let i = 0; i < this.data.columns.length; ++i) {
      const fieldName = this.data.columns[i];
      const field = this.EditDirectionFormGroup.controls[fieldName];
      if (field.value != this.data.element.name[i]) {
        let editedInsHierarchy = this.data.element.insHierarchies[i];
        editedInsHierarchy.title = field.value;
        this.editedInsHierarchies.push(editedInsHierarchy);
      }
    }

    if (!this.compareTwoArrays(this.directionsControl.value, this.lastInsHierarchy.directions)) {//(this.directionsControl.value != this.lastInsHierarchy.directions) {
      let editedInsHierarchy = this.editedInsHierarchies.find(ins => ins.id === this.lastInsHierarchy.id);
      if (editedInsHierarchy) {
        editedInsHierarchy.directions = this.directionsControl.value;
      }
      else {
        editedInsHierarchy = this.lastInsHierarchy;
        editedInsHierarchy.directions = this.directionsControl.value;
        this.editedInsHierarchies.push(editedInsHierarchy);
      }
    }

    forkJoin(
      this.editedInsHierarchies.map(ins => this.editInstitutionalHierarchy(ins))).subscribe((result) => {
        this.store.dispatch(new GetAllInstitutionsHierarchy());
        this.reloadPage();
    });

    this.closeDialog();
  }

  editInstitutionalHierarchy(insHierarchy: InstituitionHierarchy): Observable<InstituitionHierarchy> {
    return this.institutionService.editInstitutionHierarchy(insHierarchy);
  }

  lastInputFocus() {
    let inputs = this.editForm.nativeElement.getElementsByTagName('input') as HTMLInputElement[];
    let lastInput = inputs[inputs.length - 1];
    lastInput.focus();
  }

  reloadPage() {
    const currentUrl = this.router.url;
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
      this.router.navigate([currentUrl]);
    });
  }

  closeDialog() {
    this.dialogRef.close();
  }

  onRemoveItem(direction: DataItem): void {
    this.directionsControl.value.splice(this.directionsControl.value.indexOf(direction), 1);
    this.select.options.find((option: MatOption) => option.value.id === direction.id).deselect();
  }

  compareDirections(direction: DataItem, direction2: DataItem): boolean {
    return direction.id === direction2.id;
  }

  compareTwoArrays(array1: Direction[], array2: Direction[]): boolean {
    return (
      array1.length === array2.length &&
      array1.every((element_1) =>
        array2.some((element_2) =>
          Object.keys(element_1).every((key) => element_1[key] === element_2[key])
        )
      )
    );
  }
}