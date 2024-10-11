import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlaylistsV2Component } from './playlists-v2.component';

describe('PlaylistsV2Component', () => {
  let component: PlaylistsV2Component;
  let fixture: ComponentFixture<PlaylistsV2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlaylistsV2Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlaylistsV2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
