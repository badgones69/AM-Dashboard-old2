import {TestBed} from '@angular/core/testing';

import {CountryService} from './country.service';
import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";
import dbJson from "../../../db/db.json";
import {HTTP_GET_REQUEST} from "../constants/services-constants";

describe('CountryService', () => {
  let service: CountryService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({imports: [HttpClientTestingModule]});
    service = TestBed.inject(CountryService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('#getCountries should return all countries', (done) => {
    service.getCountries().subscribe(countries => {
      expect(countries.length).toEqual(211);
      done();
    });

    const req = httpTestingController.expectOne(request => request.method === HTTP_GET_REQUEST);
    req.flush(dbJson.countries);
  });
});
