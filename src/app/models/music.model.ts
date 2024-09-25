export interface Playlist {
  id: string;
  creator?: string;
  name: string;
  description?: string;
  songCount: number;
  source: SourceType;
  imageUrl: string;
  href: string; //to get more data from api
}

export interface PlaylistDetails extends Playlist {
  songs: Song[];
  //song_count:number;
}

export interface SpotifyPlaylistDetails extends PlaylistDetails {
  contextUri: string;
}

export enum SourceType {
  SPOTIFY = 'SPOTIFY',
  APPLE_MUSIC = 'APPLE_MUSIC',
  SYNCIFY = 'SYNCIFY',
  NONE = 'NONE',
  CSV = 'CSV',
  JSON = 'JSON',
}

/* export const sourceTypeToAssetMap: Map<string, string> = {
  : 'assets/Spotify_Primary_Logo_RGB_Green.png',
  apple_music: 'assets/Apple_Music_Icon_RGB_sm_073120.svg',
  syncify: 'assets/guitar_icon.jpg',
}; */

export enum SyncType {
  REPLACE = 'replace',
  MERGE = 'merge',
}

export enum TransferSide {
  SOURCE = 'Source',
  DESTINATION = 'Destination',
}

export enum ReleaseType {
  SINGLE = 'Single',
  ALBUM = 'Album',
}

export interface SpotifySong extends Song {
  contextUri: string;
}

export interface Song {
  name: string;
  artist: string;
  album: string;
  genre: string;
  time?: string;
  imageUrl?: string;
  href: string;
  remoteId: string;
  releaseYear: number;
  hovered: false;
}

export interface PlaylistSelectedEvent {
  sourceType: SourceType;
  playlist: PlaylistDetails | null;
  transferSide: TransferSide;
}
