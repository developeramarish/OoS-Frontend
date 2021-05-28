import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms'
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { Child } from 'src/app/shared/models/child.model';
import { ChangePage } from 'src/app/shared/store/app.actions';
import { GetChildrenById } from 'src/app/shared/store/user.actions';
import { UserState } from 'src/app/shared/store/user.state';


@Component({
  selector: 'app-parent-config',
  templateUrl: './parent-config.component.html',
  styleUrls: ['./parent-config.component.scss']
})
export class ParentConfigComponent implements OnInit {
  form: FormGroup;

  @Select(UserState.children) cards$: Observable<Child[]>;
  public cards: Child[];

  constructor(private fb: FormBuilder, private store: Store) { }
  

  ngOnInit(): void {
    this.store.dispatch(new ChangePage(false));
    this.store.dispatch(new GetChildrenById(null));
    this.cards$.subscribe(cards => this.cards = cards);
  }
}