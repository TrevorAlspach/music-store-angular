import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppleMusicProfileComponent } from './apple-music-profile.component';

describe('AppleMusicProfileComponent', () => {
  let component: AppleMusicProfileComponent;
  let fixture: ComponentFixture<AppleMusicProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppleMusicProfileComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppleMusicProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
