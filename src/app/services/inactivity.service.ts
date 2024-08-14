import { Injectable, Inject, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { DOCUMENT } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class InactivityService {
  private timeoutId: any;
  private readonly timeoutDuration = 10 * 60 * 1000; // 5 minutes

  constructor(
    private authService: AuthService,
    private router: Router,
    private ngZone: NgZone,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.setupInactivityListener();
  }

  setupInactivityListener() {
    this.resetTimeout();

    // List of user events that will reset the inactivity timer
    const events = ['mousemove', 'keydown', 'mousedown', 'touchstart'];

    events.forEach((event) => {
      this.document.addEventListener(event, () => this.resetTimeout());
    });
  }

  resetTimeout() {
    // Clear the previous timeout
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }

    // Set a new timeout
    this.ngZone.runOutsideAngular(() => {
      this.timeoutId = setTimeout(
        () => this.logoutUser(),
        this.timeoutDuration
      );
    });
  }

  logoutUser() {
    this.ngZone.run(() => {
      this.authService.logout(); 
      //this.router.navigate(['/login']);
    });
  }
}
