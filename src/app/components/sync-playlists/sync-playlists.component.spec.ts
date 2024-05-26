import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SyncPlaylistsComponent } from './sync-playlists.component';

describe('SyncPlaylistsComponent', () => {
  let component: SyncPlaylistsComponent;
  let fixture: ComponentFixture<SyncPlaylistsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SyncPlaylistsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SyncPlaylistsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
