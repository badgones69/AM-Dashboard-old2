import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {Region} from "../models/region";
import {Observable} from "rxjs";
import {REGION_SERVICE_URL} from "../constants/services-constants";

@Injectable({
  providedIn: 'root'
})
export class RegionService {

  constructor(private http: HttpClient) {}

  public getRegionsByCountry(countryId: number): Observable<Region[]>{
    const params = new HttpParams().set('countryId', countryId);
    return this.http.get<Region[]>(`${REGION_SERVICE_URL}?${params.toString()}`);
  }
}
