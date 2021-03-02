import {Injectable} from '@angular/core';
import {CanLoad, Route, UrlSegment, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable} from 'rxjs';
import {Store} from '@ngxs/store';
import {UserRegistrationState} from '../../shared/store/user-registration.state';

@Injectable({
  providedIn: 'root'
})
export class ProviderGuard implements CanLoad {
  constructor(public store: Store) {
  }

  canLoad(
    route: Route,
    segments: UrlSegment[]): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const role = this.store.selectSnapshot<string>(UserRegistrationState.role);
    return role === 'organization';
  }
}