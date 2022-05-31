import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PaginationConstants } from '../../constants/constants';
import { Child, ChildCards } from '../../models/child.model';
import { SocialGroup } from '../../models/socialGroup.model';
import { UserStateModel } from '../../store/user.state';
@Injectable({
  providedIn: 'root'
})

export class ChildrenService {

  constructor(private http: HttpClient) { }

  private setParams(state: UserStateModel): HttpParams {
    let params = new HttpParams();

    if (state.currentPage) {
      const size: number = PaginationConstants.ITEMS_PER_PAGE_DEFAULT;
      const from: number = size * (+state.currentPage.element - 1);

      params = params.set('Size', (size).toString());
      params = params.set('From', (from).toString());
    }

    return params;
  }

  /**
   * This method get children by Parent Child id
   * @param id: number
   */
  getUsersChildren(state: UserStateModel): Observable<ChildCards> {
    const options = { params: this.setParams(state) };

    return this.http.get<ChildCards>(`/api/v1/Child/GetUsersChildren`, options);
  }

  /**
   * This method get children by Parent Child id
   * @param id: number
   */
  getAllUsersChildren(): Observable<ChildCards> {
    let params = new HttpParams();
    params = params.set('Size', '0');
    params = params.set('From', '0');

    return this.http.get<ChildCards>(`/api/v1/Child/GetUsersChildren`, { params });
  }

    /**
   * This method get children for Admin
   */
  getChildrenForAdmin(): Observable<ChildCards> {
    let params = new HttpParams();
    params = params.set('Size', '0');
    params = params.set('From', '0');

    return this.http.get<ChildCards>(`/api/v1/Child/GetAllForAdmin`, { params });
  }


  /**
   * This method create Child
   * @param child: Child
   */
  createChild(child: Child): Observable<object> {
    return this.http.post('/api/v1/Child/Create', child);
  }

  /**
   * This method update Child
   * @param child: Child
   */
  updateChild(child: Child): Observable<object> {
    return this.http.put('/api/v1/Child/Update', child);
  }

  /**
   * This method get Users Child By Id
   * @param id: string
   */
  getUsersChildById(id: string): Observable<Child> {
    return this.http.get<Child>(`/api/v1/Child/GetUsersChildById/${id}`);
  }


  /**
   * This method delete child by Child id
   * @param id: string
   */
  deleteChild(id: string): Observable<object> {
    return this.http.delete(`/api/v1/Child/Delete/${id}`);
  }

  /**
   * This method get all social groups
   */
  getSocialGroup(): Observable<SocialGroup[]> {
    return this.http.get<SocialGroup[]>('/api/v1/SocialGroup/Get');
  }

  /**
   * This method get all social groups by Id
   */
  getSocialGroupById(id: number): Observable<SocialGroup> {
    return this.http.get<SocialGroup>(`/api/v1/SocialGroup/GetById/${id}`);
  }
}
