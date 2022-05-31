import { Provider } from 'src/app/shared/models/provider.model';
import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { ProviderService } from 'src/app/shared/services/provider/provider.service';
import { Select, Store } from '@ngxs/store';
import { Observable, Subject } from 'rxjs';
import { AdminState } from 'src/app/shared/store/admin.state';
import { GetAllProviders } from 'src/app/shared/store/admin.actions';
import { MatSort, Sort } from '@angular/material/sort';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatTableDataSource } from '@angular/material/table';
import { Constants } from 'src/app/shared/constants/constants';
import { filter, takeUntil } from 'rxjs/operators';
import {
  CreateProviderSteps,
  OwnershipTypeUkr,
} from 'src/app/shared/enum/provider';

@Component({
  selector: 'app-provider-list',
  templateUrl: './provider-list.component.html',
  styleUrls: ['./provider-list.component.scss'],
})
export class ProviderListComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(MatSort) sort: MatSort;

  readonly constants: typeof Constants = Constants;
  readonly ownershipTypeUkr = OwnershipTypeUkr;
  
  @Select(AdminState.providers)
  providers$: Observable<Provider[]>;
  provider: Provider;
  destroy$: Subject<boolean> = new Subject<boolean>();
  isInfoDisplayed: boolean;
  displayedColumns: string[] = [
    'fullTitle',
    'ownership',
    'edrpouIpn',
    'licence',
    'city',
    'street',
    'director',
    'email',
    'website',
    'shortTitle',
    'phoneNumber',
    'founder',
    'actualAddress',
    'status',
    'star',
  ];
  dataSource: MatTableDataSource<object>;

  constructor(
    private _liveAnnouncer: LiveAnnouncer,
    private store: Store,
    public providerService: ProviderService
  ) {}

  ngOnInit(): void {
    this.getAllProviders();
  }

  ngAfterViewInit(): void {
    this.providers$
      .pipe(
        takeUntil(this.destroy$),
        filter((providers) => !!providers)
      ).subscribe((providers) => {
        this.dataSource = new MatTableDataSource(providers);
        this.dataSource.sort = this.sort;
      });
  }

  onViewProviderInfo(provider): void {
    this.provider = provider;
    this.isInfoDisplayed = true;
  }

  announceSortChange(sortState: Sort): void {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  private getAllProviders(): void {
    this.store.dispatch(new GetAllProviders());
  }
  
  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}