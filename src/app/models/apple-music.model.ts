export interface AMSearchResults {
  results: SongSearchResultsWrapper;
}

export interface SongSearchResultsWrapper {
  songs: SongSearchResults;
}

export interface SongSearchResults {
  data: AMTrack[];
  href: string;
  next: string;
}

export interface SongSearchResult {}

export interface PlaylistToCreate {
  attributes: PlaylistCreationAttributes;
  relationships: PlaylistCreationRelationships;
}

export interface PlaylistCreationAttributes {
  name: string;
  description: string;
}

export interface PlaylistCreationRelationships {
  tracks: NewPlaylistTracksWrapper;
  parent: ParentFolder;
}

export interface NewPlaylistTracksWrapper {
  data: NewPlaylistTrack[];
}

export interface NewPlaylistTrack {
  id: string;
  type: string;
}

export interface ParentFolder {}

export interface ExpirationTimestamp {
  expiresAt: number;
}

export interface LibraryPlaylistsResponseWrapper {
  data: LibraryPlaylistsResponse;
  response: any;
  request: any;
}

export interface LibraryPlaylistsResponse {
  data: LibraryPlaylist[];
}

export interface PlaylistSongsResponse {
  data: AMTracks;
}

export interface LibraryPlaylist {
  id: string;
  type: string;
  href: string;
  attributes: PlaylistAttributes;
  relationships: AMPlaylistRelationship;
}

export interface AMPlaylistRelationship {
  tracks: AMTracks;
}

export interface AMTracks {
  data: AMTrack[];
  href: string;
  next?: string;
  meta: AMTracksMetadata;
}

export interface AMTrack {
  attributes: AMTrackAttributes;
  href: string;
  id: string;
  type: string;
}

export interface AMTrackAttributes {
  albumName: string;
  artistName: string;
  artwork: Artwork;
  discNumber: number;
  durationInMillis: number;
  genreNames: string[];
  hasLyrics: boolean;
  name: string;
  playParams: any;
  releaseDate: string;
  trackNumber: number;
}

export interface AMTracksMetadata {
  total: number;
}

export interface PlaylistAttributes {
  artwork: Artwork;
  canEdit: boolean;
  dateAdded: string;
  description: Description;
  hasCatalog: boolean;
  name: string;
  playParams: PlayParameters;
  isPublic: boolean;
  trackTypes: string[];
}

export interface Artwork {
  bgColor: string;
  height: number;
  width: number;
  textColor1: string;
  textColor2: string;
  textColor3: string;
  textColor4: string;
  url: string;
}

export interface Description {
  short: string;
  standard: string;
}

export interface PlayParameters {
  id: string;
  kind: string;
}
