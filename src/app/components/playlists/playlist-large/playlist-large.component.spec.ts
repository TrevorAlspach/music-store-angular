import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlaylistLargeComponent } from './playlist-large.component';

describe('PlaylistLargeComponent', () => {
  let component: PlaylistLargeComponent;
  let fixture: ComponentFixture<PlaylistLargeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlaylistLargeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PlaylistLargeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
