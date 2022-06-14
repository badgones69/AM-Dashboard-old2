import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Airline} from "../models/airline";
import {Observable} from "rxjs";
import {AIRLINE_SERVICE_URL} from "../constants/services-constants";

@Injectable({
  providedIn: 'root'
})
export class AirlineService {
  constructor(private http: HttpClient) {}

  public getAirline(id: number): Observable<Airline>{
    return this.http.get<Airline>(`${AIRLINE_SERVICE_URL}${id}`);
  }
}
