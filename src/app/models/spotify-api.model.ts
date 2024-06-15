export type TokenResponse = {
    token: string;
}

export type SpotifyUser = {
  country?: string;
  display_name: string;
  email?: string;
  explicit_content?: SpotifyExplicitContent;
  external_urls: SpotifyExternalUrls;
  followers: SpotifyFollowers;
  href: string;
  id: string;
  images?: SpotifyImage[];
  product?: string;
  type: string;
  uri: string;
};

export type SpotifyExplicitContent = {
  filter_enabled: boolean;
  filter_locked: boolean;
};

export type SpotifyExternalUrls = {
  spotify: string;
};

export type SpotifyFollowers = {
  href: any;
  total: number;
};

export type SpotifyImage = {
    url: string;
    height: number;
    width: number;
}

export type SpotifyRestrictions = {
  reason:string;
}

export type SpotifyExternalIds = {
  isrc:string;
  ean: string;
  upc: string;
}

export type SpotifyPlaylistsResponse = {
  href: string;
  limit: number;
  next:string;
  offset: number;
  previous:string;
  total: number;
  items: SpotifySimplePlaylist[];
}

export interface SpotifyPlaylistResponse extends SpotifySimplePlaylist{
  type:string;
  uri:string;
  followers: SpotifyFollowers;
  tracks: SpotifyTracksObject
};

export interface SpotifySimplePlaylist{
  collaborative: boolean;
  description: string;
  external_urls: SpotifyExternalUrls;
  href: string;
  id:string;
  images: SpotifyImage[];
  name: string;
  owner: SpotifyUser;
  public: boolean;
  snapshot_id:string;
  tracks: SpotifyTracksMetadata
};

export interface SpotifyTracksObject {
  href:string;
  limit: number;
  next:string;
  offset:number;
  previous: string;
  total: number;
  items: SpotifyTrackWrapper[]
}

export interface SpotifyTrackWrapper {
  added_at: string;
  added_by: SpotifyUser;
  is_local: boolean;
  track: SpotifyTrack & SpotifyEpisode;
}

export type SpotifyTrack = {
  album: SpotifyAlbum;
  artists: SpotifyArtist[];
  available_markets: string[];
  disc_number: number;
  duration_ms: number;
  explcit: boolean;
  external_ids: SpotifyExternalIds;
  external_urls: SpotifyExternalUrls;
  href: string;
  id:string;
  is_playable:boolean;
  linked_from: Object;
  restrictions: SpotifyRestrictions;
  name: string;
  popularity: number;
  preview_url:string;
  track_number: number;
  type: string;
  uri:string;
  is_local: boolean;
}

export type SpotifyEpisode = {
  audio_preview_url: string;
  description: string;
  html_description:string;
  duration_ms: number;
  explcit: boolean;
  external_urls: SpotifyExternalUrls;
  href: string;
  id:string;
  images: SpotifyImage[];
  is_externally_hosted: boolean;
  is_playable: boolean;
  languages: string[];
  name: string;
  release_date:string;
  release_date_precision:string;
  resume_point: any;
  type:string;
  uri:string;
  restrictions: SpotifyRestrictions;
  show: any;
}

export type SpotifyAlbum = {
  album_type: string;
  total_tracks: number;
  available_markets: string[];
  external_urls: SpotifyExternalUrls;
  href: string;
  id:string;
  images: SpotifyImage[];
  name: string;
  release_date:string;
  release_date_precision:string;
  type:string;
  uri:string;
  artists: SpotifyArtistSimple;
}

export interface SpotifyArtistSimple {
  external_urls: SpotifyExternalUrls;
  href: string;
  id:string;
  type:string;
  name: string;
  uri:string;
}

export interface SpotifyArtist extends SpotifyArtistSimple{
  followers: SpotifyFollowers;
  genres: string[];
  images: SpotifyImage[];
  popularity: number;
}


export type SpotifyTracksMetadata = {
  href:string;
  total:number;
}