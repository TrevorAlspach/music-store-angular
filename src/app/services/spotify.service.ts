import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class SpotifyService {
  readonly clientId = environment.spotifyClientId;
  readonly redirectUri = environment.spotifyRedirectUrl;

  readonly scope = 'user-read-private user-read-email';
  readonly authUrl = new URL(environment.spotifyAuthUrl);
  readonly tokenUrl = environment.spotifyTokenUrl

  constructor(private http: HttpClient) {}

  async getAuthorizationCode() {
    const codeVerifier = this.generateRandomString(64);
    const hashedVerifier = await this.sha256(codeVerifier);
    const codeChallenge = this.base64encode(hashedVerifier);

    window.localStorage.setItem('code_verifier', codeVerifier);

    const params = {
      response_type: 'code',
      client_id: this.clientId,
      scope: this.scope,
      code_challenge_method: 'S256',
      code_challenge: codeChallenge,
      redirect_uri: this.redirectUri,
    };

    this.authUrl.search = new URLSearchParams(params).toString();
    window.location.href = this.authUrl.toString();

    //const urlParams = new URLSearchParams(window.location.search);
    //let code = urlParams.get('code');
    //console.log(code)
  }

  getAccessToken(authCode: string) {
    const codeVerifier = localStorage.getItem('code_verifier') as string;

    const body = new URLSearchParams();
    body.set('client_id', this.clientId);
    body.set('grant_type', 'authorization_code')
    body.set('code', authCode)
    body.set('redirect_uri', this.redirectUri)
    body.set('code_verifier', codeVerifier);

    return this.http.post<any>(
      this.tokenUrl,
      body.toString(),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );
  }

  generateRandomString(length: number): string {
    const possible =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const values = crypto.getRandomValues(new Uint8Array(length));
    return values.reduce((acc, x) => acc + possible[x % possible.length], '');
  }

  async sha256(plaintext: string): Promise<ArrayBuffer> {
    const encoder = new TextEncoder();
    const data = encoder.encode(plaintext);
    return window.crypto.subtle.digest('SHA-256', data);
  }

  base64encode(input: ArrayBuffer): string {
    return btoa(String.fromCharCode(...new Uint8Array(input)))
      .replace(/=/g, '')
      .replace(/\+/g, '-')
      .replace(/\//g, '_');
  }

  codeVerifier = this.generateRandomString(64);
}
