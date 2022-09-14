import {Injectable} from '@angular/core';
import {ROUTE_SERVICE_URL} from "../constants/services-constants";
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class RouteService {

  constructor(private http: HttpClient) {}

  public getRoutes():Observable<any[]> {
    return this.http.get<any[]>(`${ROUTE_SERVICE_URL}`);
  }

  public createRoute(departureHubId: number, arrivalAirportId: number): Observable<any> {
    return this.http.post<any>(`${ROUTE_SERVICE_URL}`, {departureHubId, arrivalAirportId});
  }
}
