interface Scripts {
  name: string;
  src: string;
}
export const ScriptStore: Scripts[] = [
  { name: 'spotifyWebPlayer', src: 'https://sdk.scdn.co/spotify-player.js' },
  {
    name: 'appleMusicKit',
    src: 'https://js-cdn.music.apple.com/musickit/v3/musickit.js',
  },
];
