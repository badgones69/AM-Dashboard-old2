import {Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {Country} from "../models/country";
import {HttpClient} from "@angular/common/http";
import {COUNTRY_SERVICE_URL} from "../constants/services-constants";

@Injectable({
  providedIn: 'root'
})
export class CountryService {

  constructor(private http: HttpClient) {}

  public getCountries(): Observable<Country[]>{
    return this.http.get<Country[]>(`${COUNTRY_SERVICE_URL}`);
  }
}
