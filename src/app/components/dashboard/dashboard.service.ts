import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor() { }

  dashboardRefreshSubject$: Subject<boolean> = new Subject();
}
