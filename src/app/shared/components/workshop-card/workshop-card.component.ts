import { Component, Input, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { Workshop } from '../../models/workshop.model';
import { AppState } from '../../store/app.state';
import { DeleteWorkshop } from '../../store/provider.actions';

@Component({
  selector: 'app-workshop-card',
  templateUrl: './workshop-card.component.html',
  styleUrls: ['./workshop-card.component.scss']
})
export class WorkshopCardComponent implements OnInit {

  @Select(AppState.isMainPage)
  isMainPage$: Observable<boolean>;
  @Input() workshop: Workshop;

  constructor(private store: Store) { }

  ngOnInit(): void {
  }

  onDelete(): void {
    this.store.dispatch(new DeleteWorkshop(this.workshop))
  }
}
