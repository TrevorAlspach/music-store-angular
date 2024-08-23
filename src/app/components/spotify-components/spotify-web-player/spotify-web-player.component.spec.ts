import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpotifyWebPlayerComponent } from './spotify-web-player.component';

describe('SpotifyWebPlayerComponent', () => {
  let component: SpotifyWebPlayerComponent;
  let fixture: ComponentFixture<SpotifyWebPlayerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpotifyWebPlayerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SpotifyWebPlayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
