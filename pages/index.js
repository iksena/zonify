import { Typography } from 'antd';
import { isPast } from 'date-fns';

import fetcher from '../lib/fetcher';
import withSession from '../lib/session';

const { Link } = Typography;

const Login = ({ spotifyAuthUrl }) => <Link href={spotifyAuthUrl}>Login with Spotify</Link>;

export const getServerSideProps = withSession(async ({ req, query }) => {
  const { code } = query;
  const url = `http://localhost:3000/api/login?code=${code || ''}`;
  const { spotifyAuthUrl = null, ...newUser } = await fetcher(url);

  const user = req.session.get('user');
  if (!user && spotifyAuthUrl) {
    return {
      props: {
        spotifyAuthUrl,
      },
    };
  }

  if (!user && newUser) {
    req.session.set('user', newUser);
    await req.session.save();
  }

  return {
    redirect: {
      destination: '/rooms',
      permanent: false,
    },
  };
});

export default Login;
