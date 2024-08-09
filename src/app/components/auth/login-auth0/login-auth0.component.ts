import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';

@Component({
  selector: 'app-login-auth0',
  standalone: true,
  imports: [],
  templateUrl: './login-auth0.component.html',
  styleUrl: './login-auth0.component.scss',
})
export class LoginAuth0Component {
  constructor(public auth: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {}
}
