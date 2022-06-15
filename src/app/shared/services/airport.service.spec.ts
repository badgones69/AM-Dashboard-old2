import {TestBed} from '@angular/core/testing';

import {AirportService} from './airport.service';
import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";
import {Airport} from "../models/airport";
import {HTTP_POST_REQUEST} from "../constants/services-constants";

describe('AirportService', () => {
  let service: AirportService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({imports: [HttpClientTestingModule]});
    service = TestBed.inject(AirportService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('#createAirport should create a hub airport and return it', () => {
    const hubAirportToCreate: Airport = {
      id: 7,
      iata: 'XXX',
      name: 'X',
      city: 'X',
      country: {id: 66, isoAlpha2: 'fr', name: 'FRANCE'},
      region: null,
      hub: true
    };

    service.createAirport(hubAirportToCreate).subscribe(hubCreated => {
      expect(hubCreated).toEqual(hubAirportToCreate);
      expect(hubCreated.hub).toBeTruthy();
    });

    const req = httpTestingController.expectOne(request => request.method === HTTP_POST_REQUEST);
    req.flush(hubAirportToCreate);
  });
});
