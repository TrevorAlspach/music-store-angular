import { TestBed } from '@angular/core/testing';

import { SyncPlaylistsService } from './sync-playlists.service';

describe('SyncPlaylistsService', () => {
  let service: SyncPlaylistsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SyncPlaylistsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
