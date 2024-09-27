import { TestBed } from '@angular/core/testing';

import { TidalSdkService } from './tidal-sdk.service';

describe('TidalSdkService', () => {
  let service: TidalSdkService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TidalSdkService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
