import SpotifyWebApi from 'spotify-web-api-node';

import constants from '../constants';

const initiateSpotify = (params) => {
  const spotify = new SpotifyWebApi({
    clientId: constants.SPOTIFY_CLIENT_ID,
    clientSecret: constants.SPOTIFY_CLIENT_SECRET,
    redirectUri: constants.BASE_URL,
    ...params,
  });

  return spotify;
};

export default initiateSpotify;
