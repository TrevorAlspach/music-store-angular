import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppleMusicWebPlayerComponent } from './apple-music-web-player.component';

describe('AppleMusicWebPlayerComponent', () => {
  let component: AppleMusicWebPlayerComponent;
  let fixture: ComponentFixture<AppleMusicWebPlayerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppleMusicWebPlayerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppleMusicWebPlayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
