import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { TidalSdkService } from '../../../services/external-services/tidal-sdk.service';

@Component({
  selector: 'app-tidal-auth',
  standalone: true,
  imports: [CommonModule, MatProgressSpinnerModule],
  templateUrl: './tidal-auth.component.html',
  styleUrl: './tidal-auth.component.scss',
})
export class TidalAuthComponent /* implements OnInit */ {
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private tidalSdkService: TidalSdkService
  ) {
    console.log('CONSTRUCTING TIDAL COMPONENT');
  }

  ngOnInit() {
    console.log('NGONINIT');
    this.route.queryParamMap.subscribe({
      next: (queryParams) => {
        const authCode = queryParams.get('code');
        if (authCode !== null) {
          this.tidalSdkService.finalizeLogin(
            this.buildQueryString(queryParams)
          );
          console.log(this.buildQueryString(queryParams));
          console.log('Auth Code Tidal');
        } else {
          //handle error
        }
      },
    });
  }

  private buildQueryString(params: ParamMap): string {
    const queryParams: string[] = [];
    for (const key in params) {
      if (params.hasOwnProperty(key)) {
        queryParams.push(`${key}=${params.get(key)}`);
      }
    }
    return queryParams.length ? `?${queryParams.join('&')}` : '';
  }
}
