import {TestBed} from '@angular/core/testing';

import {AirlineService} from './airline.service';
import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";
import dbJson from "../../../db/db.json";
import {HTTP_GET_REQUEST} from "../constants/services-constants";

describe('AirlineService', () => {
  let service: AirlineService;
  let httpTestingController: HttpTestingController;
  beforeEach(() => {
    TestBed.configureTestingModule({imports: [HttpClientTestingModule]});
    service = TestBed.inject(AirlineService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });
  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  it('#getAirline should return \'X\' airline', (done) => {
    service.getAirline(1).subscribe(airline => {
      expect(airline.icao).toEqual('XXX');
      expect(airline.name).toEqual('X');
      done();
    });

    const req = httpTestingController.expectOne(request => request.method === HTTP_GET_REQUEST);
    req.flush(dbJson.airlines[0]);
  });
});
