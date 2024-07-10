import { TestBed } from '@angular/core/testing';

import { TransferPlaylistsService } from './transfer-playlists.service';

describe('TransferPlaylistsService', () => {
  let service: TransferPlaylistsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TransferPlaylistsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
