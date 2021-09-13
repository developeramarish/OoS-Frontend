import { Component, HostListener, Input, OnDestroy, OnInit} from '@angular/core';
import { Navigation, Router } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Languages } from '../../enum/languages';
import { Role, RoleLinks } from '../../enum/role';
import { User } from '../../models/user.model';
import { SidenavToggle } from '../../store/navigation.actions';
import { NavigationState } from '../../store/navigation.state';
import { Login, Logout } from '../../store/registration.actions';
import { RegistrationState } from '../../store/registration.state';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent implements OnInit, OnDestroy{

  readonly Languages: typeof Languages = Languages;
  selectedLanguage: string;

  Role = Role;
  showModalReg = false;
  @Input() MobileScreen: boolean;

  title = 'out-of-school';
  visibleSidenav: boolean;

  @Select(NavigationState.sidenavOpenTrue)
  sidenavOpenTrue$: Observable<boolean>;
  @Select(RegistrationState.isAuthorized)
  isAuthorized$: Observable<boolean>;
  @Select(RegistrationState.user)
  user$: Observable<User>;
  user: User;
  roles = RoleLinks;

  destroy$: Subject<boolean> = new Subject<boolean>();


  constructor(
    public store: Store,
    private router: Router) {
  }

  changeView() {
    this.store.dispatch(new SidenavToggle());
  }

  ngOnInit(): void {
    this.selectedLanguage = localStorage.getItem('ui-culture') || 'uk';
    this.user$.subscribe(user => this.user = user);
    this.sidenavOpenTrue$
      .pipe(takeUntil(this.destroy$))
      .subscribe(visible => this.visibleSidenav = visible)
  }

  login(): void {
    this.store.dispatch(new Login());
  }

  logout(): void {
    this.store.dispatch(new Logout());
  }

  setLanguage(): void {
    localStorage.setItem('ui-culture', this.selectedLanguage);
  }

  isRouter(route: string): boolean {
    return this.router.url === route;
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

}