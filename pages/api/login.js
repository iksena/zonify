import initiateSpotify from '../../lib/spotify';

export default async function handler(req, res) {
  const { code } = req.query;
  const spotify = initiateSpotify({
    redirectUri: 'http://localhost:3000/login',
  });

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

  return res.status(200).json(response.body);
}
