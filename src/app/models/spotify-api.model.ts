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

export type SpotifyPlaylistsResponse = {
  href: string;
  limit: number;
  next:string;
  offset: number;
  previous:string;
  total: number;
  items: SpotifySimplePlaylist[];
}

export type SpotifySimplePlaylist = {
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

export type SpotifyTracksMetadata = {
  href:string;
  total:number;
}