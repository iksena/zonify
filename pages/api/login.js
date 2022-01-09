import { add } from 'date-fns';

import initiateSpotify from '../../lib/spotify';
import supabase from '../../lib/supabase';

const _createSpotifyAuthUrl = ({ spotify, state }, res) => {
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
  ], state && encodeURI(state));

  return res.status(200).json({ spotifyAuthUrl });
};

const _authorizeSpotify = async (spotify, code) => {
  const response = await spotify.authorizationCodeGrant(code);

  return {
    isLoggedIn: true,
    accessToken: response.body.access_token,
    refreshToken: response.body.refresh_token,
    expiresIn: add(new Date(), { seconds: response.body.expires_in }).toISOString(),
  };
};

const _saveAuthorizedUser = async (spotify, user) => {
  spotify.setAccessToken(user?.accessToken);
  const { body: profile } = await spotify.getMe();
  const { data: [savedProfile] } = await supabase.saveUser(profile, user);

  return savedProfile;
};

const handler = async (req, res) => {
  const { code, state } = req.query;
  const spotify = initiateSpotify();

  if (!code) {
    return _createSpotifyAuthUrl({ spotify, state }, res);
  }

  const user = await _authorizeSpotify(spotify, code);
  const profile = await _saveAuthorizedUser(spotify, user);

  return res.status(200).json({
    user: {
      ...profile,
      ...user,
    },
    ...state && { path: decodeURI(state) },
  });
};

export default handler;
