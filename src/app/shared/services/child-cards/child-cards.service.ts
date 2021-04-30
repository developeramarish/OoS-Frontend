import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Child } from '../../models/child.model';




@Injectable({
  providedIn: 'root'
})
export class ChildCardService {

  constructor(private http: HttpClient) { }

  getChildren(): Observable<Child[]> {
    return this.http.get<Child[]>('/Child/Get')
  }

  createChildren(child: Child): void {
    this.http.post('/Child/Create', child);
  }
}