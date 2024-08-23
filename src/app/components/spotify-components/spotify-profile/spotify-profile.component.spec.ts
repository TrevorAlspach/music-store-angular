import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpotifyProfileComponent } from './spotify-profile.component';

describe('SpotifyProfileComponent', () => {
  let component: SpotifyProfileComponent;
  let fixture: ComponentFixture<SpotifyProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpotifyProfileComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SpotifyProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
