import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { AuthService } from '../syncify/auth.service';
import { DOCUMENT } from '@angular/common';
import {
  CustomDocument,
  DocumentRefService,
} from '../util/document-ref.service';
import { ScriptService } from '../util/scripts/script.service';
import { CustomWindow, WindowRefService } from '../util/window-ref.service';
import { UserService } from '../syncify/user.service';
import { map, switchMap } from 'rxjs';
import { TokenResponse } from '../../models/spotify-api.model';

@Injectable({
  providedIn: 'root',
})
export class AppleMusicService {
  private musicKit!: any;
  private window!: CustomWindow;
  private document!: CustomDocument;

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private docRef: DocumentRefService,
    private scriptService: ScriptService,
    private windowRef: WindowRefService,
    private userService: UserService
  ) {}

  public init() {
    this.loadMusicKitScript();

    this.document = this.docRef.customDocument;
    this.document.addEventListener('musickitloaded', async () => {
      console.log('event was fired');
      this.window = this.windowRef.nativeWindow;

      this.userService.loggedInUser$
        .pipe(
          switchMap((user) => {
            return this.getDeveloperToken();
          })
        )
        .subscribe({
          next: async (token: string) => {
            try {
              await this.window.MusicKit.configure({
                developerToken: token,
                app: {
                  name: 'Syncify',
                  build: '1978.4.1',
                },
              });
            } catch (err) {
              // Handle configuration error
              console.log(err);
            }

            // MusicKit instance is available
            this.musicKit = this.window.MusicKit.getInstance();
            console.log(this.musicKit);
          },
        });
    });
  }

  private getDeveloperToken() {
    return this.authService.appleMusicDeveloperToken().pipe(
      map((tokenResponse) => {
        return tokenResponse.token;
      })
    );
  }

  async loadMusicKitScript() {
    let data = await this.scriptService
      .load('appleMusicKit')
      .catch((error) => console.log(error));
    console.log('script loaded ', data);
  }
}
