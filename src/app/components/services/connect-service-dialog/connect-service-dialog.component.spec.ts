import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConnectServiceDialogComponent } from './connect-service-dialog.component';

describe('ConnectServiceDialogComponent', () => {
  let component: ConnectServiceDialogComponent;
  let fixture: ComponentFixture<ConnectServiceDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConnectServiceDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConnectServiceDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
