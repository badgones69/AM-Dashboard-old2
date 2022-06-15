import {TestBed} from '@angular/core/testing';

import {RegionService} from './region.service';
import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";
import dbJson from "../../../db/db.json";
import {HTTP_GET_REQUEST} from "../constants/services-constants";

describe('RegionService', () => {
  let service: RegionService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({imports: [HttpClientTestingModule]});
    service = TestBed.inject(RegionService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('#getRegionsByCountry should return Canadian regions', (done) => {
    service.getRegionsByCountry(37).subscribe(regions => {
      expect(regions.length).toEqual(13);
      done();
    });

    const req = httpTestingController.expectOne(request => request.method === HTTP_GET_REQUEST);
    req.flush(dbJson.regions.filter(r => r.countryId === 37));
  });
});
