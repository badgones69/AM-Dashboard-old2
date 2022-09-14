import {TestBed} from '@angular/core/testing';

import {RouteService} from './route.service';
import {HTTP_GET_REQUEST, HTTP_POST_REQUEST} from "../constants/services-constants";
import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";

describe('RouteService', () => {
  let service: RouteService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({imports: [HttpClientTestingModule]});
    service = TestBed.inject(RouteService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('#getRoutes should return all routes', () => {
    const routes: any[] = [
      {
        id: 1,
        departureHubId: 2,
        arrivalAirportId: 8
      },
      {
        id: 2,
        departureHubId: 7,
        arrivalAirportId: 8
      }, {
        id: 3,
        departureHubId: 6,
        arrivalAirportId: 9
      }, {
        id: 4,
        departureHubId: 7,
        arrivalAirportId: 9
      }
    ];

    service.getRoutes().subscribe(routes => {
      expect(routes.length).toEqual(4);
    });

    const req = httpTestingController.expectOne(request => request.method === HTTP_GET_REQUEST);
    req.flush(routes);
  });

  it('#createRoute should create a route and return it', () => {
    service.createRoute(2, 8).subscribe(routeCreated => {
      expect(routeCreated.departureHubId).toEqual(2);
      expect(routeCreated.arrivalAirportId).toEqual(8);
    });

    const req = httpTestingController.expectOne(request => request.method === HTTP_POST_REQUEST);
    req.flush({departureHubId: 2, arrivalAirportId: 8});
  });
});
