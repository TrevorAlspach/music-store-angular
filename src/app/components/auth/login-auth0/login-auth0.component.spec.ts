import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginAuth0Component } from './login-auth0.component';

describe('LoginAuth0Component', () => {
  let component: LoginAuth0Component;
  let fixture: ComponentFixture<LoginAuth0Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginAuth0Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoginAuth0Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
