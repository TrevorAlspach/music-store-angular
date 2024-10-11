export const environment = {
  apiBaseUrl: 'http://localhost:8080/api/',
  spotifyRedirectUrl: `${window.location.origin}/home/spotify-auth`,
  spotifyClientId: '1567f5a6e70d4ff1a1d5e6a406b2c331',
  spotifyTokenUrl: 'https://accounts.spotify.com/api/token',
  spotifyAuthUrl: 'https://accounts.spotify.com/authorize',

  tidal: {
    clientId: 'FlohFgq0kjwtQ8HV',
    credentialsStorageKey: 'authorizationCode',
    redirectUri: 'http://localhost:4200/home/tidal-auth',
  },

  auth0: {
    clientId: 'hKjneu0AYL1q087Bxlxg1AEX6tUR5KEI',
    domain: 'dev-5icodle12xbi8dtf.us.auth0.com',
    redirect_uri: `${window.location.origin}/auth`,
    audience: 'http://localhost:8080/',
    scope: 'admin email',
    interceptor: {
      uri: 'http://localhost:8080/*',
      auth0Uri: 'https://dev-5icodle12xbi8dtf.us.auth0.com/*'
    },
  },
};
