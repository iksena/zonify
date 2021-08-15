import { add } from 'date-fns';

import initiateSpotify from '../../lib/spotify';

const handler = async (req, res) => {
  const { code } = req.query;
  const spotify = initiateSpotify();

  if (!code) {
    const spotifyAuthUrl = spotify.createAuthorizeURL([
      'user-top-read',
      'user-read-recently-played',
      'user-read-playback-state',
      'app-remote-control',
      'playlist-modify-public',
      'user-modify-playback-state',
      'playlist-modify-private',
      'user-read-currently-playing',
      'playlist-read-private',
      'user-read-email',
      'user-read-private',
      'user-library-read',
      'playlist-read-collaborative',
      'streaming',
    ]);

    return res.status(200).json({ spotifyAuthUrl });
  }

  const response = await spotify.authorizationCodeGrant(code);
  const user = {
    isLoggedIn: true,
    accessToken: response.body.access_token,
    refreshToken: response.body.refresh_token,
    expiresIn: add(new Date(), { seconds: response.body.expires_in }).toISOString(),
  };

  return res.status(200).json({ ...user });
};

export default handler;
