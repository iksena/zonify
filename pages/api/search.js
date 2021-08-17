import initiateSpotify from '../../lib/spotify';

export default async function handler(req, res) {
  const {
    accessToken,
    query,
    limit,
    offset,
  } = req.query;
  const spotify = initiateSpotify();

  if (accessToken) {
    spotify.setAccessToken(accessToken);
    try {
      const response = await spotify.searchTracks(query, { limit, offset, market: 'from_token' });

      return res.status(200).json(response);
    } catch (error) {
      return res.json(error);
    }
  }

  return res.status(401).json({
    code: 'UNAUTHORIZED',
    message: 'You need to login with Spotify',
  });
}
