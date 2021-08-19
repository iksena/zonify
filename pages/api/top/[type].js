import initiateSpotify from '../../../lib/spotify';

const TIME_RANGE = ['short_term', 'medium_term', 'long_term'];

export default async function handler(req, res) {
  const {
    type = 0,
    accessToken,
    limit,
    offset,
    term,
  } = req.query;
  const spotify = initiateSpotify();

  if (accessToken) {
    spotify.setAccessToken(accessToken);
    try {
      const typeParam = type.charAt(0).toUpperCase() + type.slice(1);
      const response = await spotify[`getMyTop${typeParam}`]({
        limit,
        offset,
        time_range: TIME_RANGE[term],
      });

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
