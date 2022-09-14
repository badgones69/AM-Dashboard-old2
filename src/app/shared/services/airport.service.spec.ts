import {TestBed} from '@angular/core/testing';

import {AirportService} from './airport.service';
import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";
import {Airport} from "../models/airport";
import {HTTP_GET_REQUEST, HTTP_POST_REQUEST} from "../constants/services-constants";

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

  it('#getAiports should return all airports', () => {
    const airports: Airport[] = [
      {
        id: 1,
        iata: 'QQQ',
        name: 'Q',
        city: 'Q',
        country: {id: 62, isoAlpha2: 'us', name: 'ÉTATS-UNIS'},
        region: null,
        hub: true
      }, {
        id: 2,
        iata: 'RRR',
        name: 'R',
        city: 'R',
        country: {id: 37, isoAlpha2: 'ca', name: 'CANADA'},
        region: null,
        hub: false
      }, {
        id: 3,
        iata: 'SSS',
        name: 'S',
        city: 'S',
        country: {id: 40, isoAlpha2: 'cn', name: 'CHINE'},
        region: null,
        hub: false
      }, {
        id: 4,
        iata: 'TTT',
        name: 'T',
        city: 'T',
        country: {id: 46, isoAlpha2: 'kr', name: 'CORÉE DU SUD'},
        region: null,
        hub: true
      }, {
        id: 5,
        iata: 'UUU',
        name: 'U',
        city: 'U',
        country: {id: 176, isoAlpha2: 'sn', name: 'SÉNÉGAL'},
        region: null,
        hub: false
      }, {
        id: 6,
        iata: 'VVV',
        name: 'V',
        city: 'V',
        country: {id: 146, isoAlpha2: 'ug', name: 'OUGANDA'},
        region: null,
        hub: true
      }, {
        id: 7,
        iata: 'WWW',
        name: 'W',
        city: 'W',
        country: {id: 66, isoAlpha2: 'fr', name: 'FRANCE'},
        region: null,
        hub: true
      }, {
        id: 8,
        iata: 'XXX',
        name: 'X',
        city: 'X',
        country: {id: 204, isoAlpha2: 'ua', name: 'UKRAINE'},
        region: null,
        hub: false
      }, {
        id: 9,
        iata: 'YYY',
        name: 'Y',
        city: 'Y',
        country: {id: 144, isoAlpha2: 'nz', name: 'NOUVELLE-ZÉLANDE'},
        region: null,
        hub: true
      },
      {
        id: 10,
        iata: 'ZZZ',
        name: 'Z',
        city: 'Z',
        country: {id: 13, isoAlpha2: 'au', name: 'AUSTRALIE'},
        region: null,
        hub: false
      }
    ];

    service.getAirports().subscribe(airports => {
      expect(airports.length).toEqual(10);
    });

    const req = httpTestingController.expectOne(request => request.method === HTTP_GET_REQUEST);
    req.flush(airports);
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
