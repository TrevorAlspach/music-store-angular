export type Playlist = {
    id?:string;
    name:string;
    songs: Song[];
}

export type Song = {
    name: string;
    artistName: string;
    genre: string;
    //albumImage:
}