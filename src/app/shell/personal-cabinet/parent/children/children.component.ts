import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

import { ConfirmationModalWindowComponent } from 'shared/components/confirmation-modal-window/confirmation-modal-window.component';
import { Constants, ModeConstants, PaginationConstants } from 'shared/constants/constants';
import { NavBarName } from 'shared/enum/enumUA/navigation-bar';
import { ModalConfirmationType } from 'shared/enum/modal-confirmation';
import { Child, ChildrenParameters } from 'shared/models/child.model';
import { PaginationElement } from 'shared/models/pagination-element.model';
import { SearchResponse } from 'shared/models/search.model';
import { PushNavPath } from 'shared/store/navigation.actions';
import { DeleteChildById, GetUsersChildren } from 'shared/store/parent.actions';
import { ParentState } from 'shared/store/parent.state';
import { Util } from 'shared/utils/utils';
import { ParentComponent } from '../parent.component';

@Component({
  selector: 'app-children',
  templateUrl: './children.component.html',
  styleUrls: ['./children.component.scss']
})
export class ChildrenComponent extends ParentComponent implements OnInit, OnDestroy {
  @Select(ParentState.children)
  public childrenCards$: Observable<SearchResponse<Child[]>>;

  public readonly ModeConstants = ModeConstants;

  public childrenCards: SearchResponse<Child[]>;
  public currentPage: PaginationElement = PaginationConstants.firstPage;
  public childrenParameters: ChildrenParameters = {
    searchString: '',
    isParent: null,
    size: PaginationConstants.CHILDREN_PER_PAGE
  };

  constructor(
    protected store: Store,
    protected matDialog: MatDialog
  ) {
    super(store, matDialog);
  }

  public addNavPath(): void {
    this.store.dispatch(
      new PushNavPath({
        name: NavBarName.Children,
        isActive: false,
        disable: true
      })
    );
  }

  public initParentData(): void {
    this.getChildren();
    this.childrenCards$.pipe(filter(Boolean), takeUntil(this.destroy$)).subscribe((childrenCards: SearchResponse<Child[]>) => {
      childrenCards.entities = childrenCards.entities.filter((child: Child) => !child.isParent);
      this.childrenCards = childrenCards;
    });
  }

  public onDelete(child: Child): void {
    const dialogRef = this.matDialog.open(ConfirmationModalWindowComponent, {
      width: Constants.MODAL_SMALL,
      data: {
        type: ModalConfirmationType.deleteChild,
        property: `${child.firstName} ${child.lastName}`
      }
    });

    dialogRef
      .afterClosed()
      .pipe(filter(Boolean))
      .subscribe((result: boolean) => this.store.dispatch(new DeleteChildById(child.id, this.childrenParameters)));
  }

  public onItemsPerPageChange(itemsPerPage: number): void {
    this.childrenParameters.size = itemsPerPage;
    this.onPageChange(PaginationConstants.firstPage);
  }

  public onPageChange(page: PaginationElement): void {
    this.currentPage = page;
    this.getChildren();
  }

  private getChildren(): void {
    Util.setFromPaginationParam(this.childrenParameters, this.currentPage, this.childrenCards?.totalAmount);
    this.store.dispatch(new GetUsersChildren(this.childrenParameters));
  }
}
