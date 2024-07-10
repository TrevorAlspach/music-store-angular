import { TestBed } from '@angular/core/testing';

import { DiscogsService } from './discogs.service';

describe('DiscogsService', () => {
  let service: DiscogsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DiscogsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
