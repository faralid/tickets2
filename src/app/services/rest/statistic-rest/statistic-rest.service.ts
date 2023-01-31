import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {IStatisticUser} from "../../../models/users";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class StatisticRestService {

  constructor( private http: HttpClient) { }

  getUserStatistic(): Observable<IStatisticUser[]>{
    return this.http.get<IStatisticUser[]>('https://jsonplaceholder.typicode.com/users')
  }

}

