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

  ngOnInit(){
    this.route.queryParamMap.subscribe({
      next: (queryParams) => {
        const authCode = queryParams.get('code');
        if (authCode !== null) {
          console.log(authCode)
          //localStorage.setItem('auth0-token', authCode);
    /*       this.auth.getAccessTokenSilently().subscribe({
            next: (token)=>{
              localStorage.setItem('auth0-token', token);
            }
          })

          this.router.navigate(['dashboard']); */
        } else {
          //handle error
        }

        console.log(authCode);
      },
    });
  }
}
