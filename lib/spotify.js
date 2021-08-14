import SpotifyWebApi from 'spotify-web-api-node';

const initiateSpotify = (params) => {
  const spotify = new SpotifyWebApi({
    clientId: 'dab01471a9ab4e79801304a700334560',
    clientSecret: '50182d32e6c042feaceebdb294a9c741',
    redirectUri: 'http://localhost:3000/',
    ...params,
  });

  return spotify;
};

export default initiateSpotify;
