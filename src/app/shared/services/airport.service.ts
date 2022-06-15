import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Airport} from "../models/airport";
import {AIRPORT_SERVICE_URL} from "../constants/services-constants";

@Injectable({
  providedIn: 'root'
})
export class AirportService {

  constructor(private http: HttpClient) {}

  public createAirport(airport: Airport): Observable<Airport> {
    return this.http.post<Airport>(`${AIRPORT_SERVICE_URL}`, airport);
  }
}
