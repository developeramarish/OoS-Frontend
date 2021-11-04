import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Rate } from '../../models/rating';

@Injectable({
  providedIn: 'root'
})
export class RatingService {

  constructor(private http: HttpClient) { }

  /**
   * This method get Rate pf entity by its entityId
   * @param entityType: string
   * @param entityId: number
   */
  getRateByEntityId(entityType: string, entityId: number): Observable<Rate[]> {
    return this.http.get<Rate[]>(`/api/v1/Rating/GetByEntityId/${entityType}/${entityId}`);
  }

  /**
   * This method create Rate
   * @param rate: Rate
   */
  createRate(rate: Rate): Observable<object> {
    return this.http.post('/api/v1/Rating/Create', rate);
  }

  /**
   * This method update Rate
   * @param rate: Rate
   */
  updateRate(rate: Rate): Observable<object> {
    return this.http.put('/api/v1/Rating/Update', rate);
  }
}
