import {LiveAnnouncer} from '@angular/cdk/a11y';
import {AfterViewInit, Component, Input, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {MatSort, Sort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';

/**
 * @title Table with sorting
 */
@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss']
})
export class UsersListComponent implements OnInit, AfterViewInit {

  @Input() users: Array<object>;
  @Input() filterValue: string;

  
  displayedColumns: string[];
  dataSource: MatTableDataSource<object> = new MatTableDataSource([{}]);

  constructor(private _liveAnnouncer: LiveAnnouncer) {}

  @ViewChild(MatSort) sort: MatSort;

  ngOnInit(): void {
      this.displayedColumns = ['pib', 'email', 'phone', 'deputy'];
      this.dataSource = new MatTableDataSource(this.users);
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  ngOnChanges(changes: SimpleChanges) {
      if (changes.filterValue && changes.filterValue.currentValue) {
        let filter = changes.filterValue.currentValue;
        this.dataSource.filter = filter.trim().toLowerCase();
      } else this.dataSource.filter = "";
      
      if (changes.users && changes.users.currentValue) {
        const users = changes.users.currentValue;
        this.dataSource = new MatTableDataSource(users);
      }
  }

  /** Announce the change in sort state for assistive technology. */
  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }
}