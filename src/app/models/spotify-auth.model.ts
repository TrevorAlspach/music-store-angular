export type TokenResponse = {
    token: string;
}

export type SpotifyUser = {
  country: string;
  display_name: string;
  email: string;
  explicit_content: SpotifyExplicitContent;
  external_urls: SpotifyExternalUrls;
  followers: SpotifyFollowers;
  href: string;
  id: string;
  images: SpotifyImage[];
  product: string;
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