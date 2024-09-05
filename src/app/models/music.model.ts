export interface Playlist{
    id:string;
    creator?:string;
    name:string;
    description?: string;
    songCount: number;
    source: SourceType;
    imageUrl: string;
    href: string;  //to get more data from api
}

export interface PlaylistDetails extends Playlist{
    songs: Song[];
    //song_count:number;
}

export interface SpotifyPlaylistDetails extends PlaylistDetails{
  contextUri: string;
}

export enum SourceType {
    SPOTIFY="spotify",
    APPLE_MUSIC="apple_music",
    SYNCIFY="syncify",
    NONE="none"
}


export enum TransferSide {
  SOURCE = 'Source',
  DESTINATION = 'Destination',
}

export enum ReleaseType {
    SINGLE="Single", 
    ALBUM="Album"
}
 
export interface SpotifySong extends Song{
  contextUri: string;
}

export interface Song{
  name: string;
  artist: string;
  album: string;
  genre: string;
  time?: string;
  imageUrl?: string;
  href: string;
  remoteId:string
  releaseYear: number;
  hovered: false;
};