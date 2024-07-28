import { Component } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { User } from '../../../models/user.model';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    RouterModule,
  ],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss',
})
export class SignupComponent {
  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private router: Router
  ) {}

  signupForm: FormGroup = this.fb.group({
    email: [null, [Validators.required, Validators.email]],
    password: [null, [Validators.required, Validators.minLength(6)]],
    username: [null, [Validators.required, Validators.minLength(6)]],
  });

  register() {
    console.log('signup');
    if (this.signupForm.valid) {
      this.authService
        .signupUser(
          this.signupForm.get('email')?.value,
          this.signupForm.get('password')?.value,
          this.signupForm.get('username')?.value
        )
        .subscribe({
          next: (response: User) => {
            console.log('signed up ');
            console.log(response);
            this.router.navigate(['login']);
          },
          error: (e: HttpErrorResponse) => {
            console.log(e);
          },
        });
    }
  }
}
