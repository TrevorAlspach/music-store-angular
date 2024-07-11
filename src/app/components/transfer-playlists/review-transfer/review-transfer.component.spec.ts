import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewTransferComponent } from './review-transfer.component';

describe('ReviewTransferComponent', () => {
  let component: ReviewTransferComponent;
  let fixture: ComponentFixture<ReviewTransferComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReviewTransferComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReviewTransferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
