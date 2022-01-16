import { mapAuthResponse } from '../../lib/auth';
import initiateSpotify from '../../lib/spotify';
import supabase from '../../lib/supabase';

const _createSpotifyAuthUrl = ({ spotify, state }, res) => {
  const spotifyAuthUrl = spotify.createAuthorizeURL([
    'user-top-read',
    'playlist-modify-public',
    'playlist-modify-private',
    'playlist-read-private',
    'playlist-read-collaborative',
    'user-read-email',
    'user-read-private',
  ], state && encodeURI(state));

  return res.status(200).json({ spotifyAuthUrl });
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

  const authResponse = await spotify.authorizationCodeGrant(code);
  const user = mapAuthResponse(authResponse);
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
