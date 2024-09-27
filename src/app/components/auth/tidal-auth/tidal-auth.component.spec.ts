import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TidalAuthComponent } from './tidal-auth.component';

describe('TidalAuthComponent', () => {
  let component: TidalAuthComponent;
  let fixture: ComponentFixture<TidalAuthComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TidalAuthComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TidalAuthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
