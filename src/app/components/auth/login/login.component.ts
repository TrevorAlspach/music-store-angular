import { Component } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import { AuthService } from '../../../services/auth.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { User } from '../../../models/user.model';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ MatFormFieldModule, MatInputModule, MatButtonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  constructor(private authService: AuthService, private fb: FormBuilder, private router: Router){

  }

  loginForm: FormGroup = this.fb.group({
    email: [null, [Validators.required, Validators.email]],
    password: [null, [Validators.required, Validators.minLength(6)]]
  })

  login(){
    console.log('login')
    if (this.loginForm.valid){
      this.authService.login(this.loginForm.get("email")?.value, this.loginForm.get("password")?.value).subscribe({
        next: (response: User)=>{
          console.log('logged in');
          console.log(response);
          this.router.navigate(['/dashboard'])

          //do logic to keep user stored in local storage
          
        },
         error: (e: HttpErrorResponse) => {
          console.log(e);
         }
      })
    }
    
  }

}
