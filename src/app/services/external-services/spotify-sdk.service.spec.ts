import { TestBed } from '@angular/core/testing';

import { SpotifySdkService } from './spotify-sdk.service';

describe('SpotifySdkService', () => {
  let service: SpotifySdkService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SpotifySdkService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
