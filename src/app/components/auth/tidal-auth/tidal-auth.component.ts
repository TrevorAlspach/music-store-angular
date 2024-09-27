import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-tidal-auth',
  standalone: true,
  imports: [CommonModule, MatProgressSpinnerModule],
  templateUrl: './tidal-auth.component.html',
  styleUrl: './tidal-auth.component.scss',
})
export class TidalAuthComponent /* implements OnInit */ {
  constructor(private route: ActivatedRoute, private router: Router) {
    console.log('CONSTRUCTING TIDAL COMPONENT');
  }

  ngOnInit() {
    console.log('NGONINIT');
    this.route.queryParamMap.subscribe({
      next: (queryParams) => {
        const authCode = queryParams.get('code');
        if (authCode !== null) {
          console.log(authCode);
          console.log('Auth Code Tidal');
        } else {
          //handle error
        }
      },
    });
  }
}
