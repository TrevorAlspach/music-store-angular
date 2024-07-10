export interface Playlist{
    id?:string;
    creator?:string;
    name:string;
    description?: string;
    //songs: Song[];
    source: SourceType
    imageUrl: string;
    href: string;  //to get more data from api
}

export interface PlaylistDetails extends Playlist{
    songs: Song[];
    song_count:number;
}

export enum SourceType {
    SPOTIFY="spotify",
    APPLE_MUSIC="apple_music"
}

export enum ReleaseType {
    SINGLE="Single", 
    ALBUM="Album"
}

export type Song = {
    name: string;
    artist: string;
    album: string;
    genre: string;
    time?: string;
    image_url?:string;
    href: string;
}