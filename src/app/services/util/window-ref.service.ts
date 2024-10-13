import { Injectable } from '@angular/core';

export interface CustomWindow extends Window {
  onSpotifyWebPlaybackSDKReady: any;
  MusicKit: any;
}

function getWindow(): any {
  return window;
}

@Injectable()
export class WindowRefService {
  get nativeWindow(): CustomWindow {
    return getWindow();
  }
}
