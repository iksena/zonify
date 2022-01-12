import { mapAuthResponse } from '../../lib/auth';
import initiateSpotify from '../../lib/spotify';

const handler = async (req, res) => {
  const { refreshToken } = req.query;
  const spotify = initiateSpotify();
  spotify.setRefreshToken(refreshToken);

  const authResponse = await spotify.refreshAccessToken();
  const user = mapAuthResponse(authResponse);

  return res.status(200).json({ user });
};

export default handler;
