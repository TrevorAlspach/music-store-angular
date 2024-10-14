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
  TIDAL = 'TIDAL',
  APPLE_MUSIC = 'APPLE_MUSIC',
  SYNCIFY = 'SYNCIFY',
  YOUTUBE_MUSIC = 'YOUTUBE_MUSIC',
  NONE = 'NONE',
  CSV = 'CSV',
  JSON = 'JSON',
}

export enum ViewType {
  CAROUSEL = 'CAROUSEL',
  TABLE = 'TABLE',
}

export const connectableServices = [
  {
    sourceType: SourceType.APPLE_MUSIC,
    logoPath: 'assets/Apple_Music_Icon_RGB_sm_073120.svg',
    name: 'Apple Music',
    supported: true,
    alreadyConnected: false,
  },
  {
    sourceType: SourceType.SPOTIFY,
    logoPath: 'assets/Spotify_Primary_Logo_RGB_Green.png',
    name: 'Spotify',
    supported: true,
    alreadyConnected: false,
  },
  {
    sourceType: SourceType.TIDAL,
    logoPath: 'assets/icon-white-rgb.png',
    name: 'Tidal',
    supported: true,
    alreadyConnected: false,
  },
  {
    sourceType: SourceType.SYNCIFY,
    logoPath: 'assets/syncify.png',
    name: 'Syncify',
    supported: true,
    alreadyConnected: false,
  },
  {
    sourceType: SourceType.YOUTUBE_MUSIC,
    logoPath: 'assets/youtube_icon.png',
    name: 'Youtube Music',
    supported: false,
    alreadyConnected: false,
  },
];

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
