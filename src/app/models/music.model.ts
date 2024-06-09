export type Playlist = {
    id?:string;
    name:string;
    songs: Song[];
    source: SourceType
    imageUrl: string;
    href: string;  //to get more data from api
}

export enum SourceType {
    SPOTIFY="spotify",
    APPLE_MUSIC="apple_music"
}

export type Song = {
    name: string;
    artistName: string;
    genre: string;
    //albumImage:
}