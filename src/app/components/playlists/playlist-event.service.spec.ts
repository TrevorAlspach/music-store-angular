import { TestBed } from '@angular/core/testing';

import { PlaylistEventService } from './playlist-event.service';

describe('PlaylistEventService', () => {
  let service: PlaylistEventService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PlaylistEventService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
