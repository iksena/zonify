import { Typography, Row, Col } from 'antd';
import { isFuture } from 'date-fns';

import fetcher from '../lib/fetcher';
import withSession from '../lib/session';
import constants from '../constants';

const { Link } = Typography;

const Login = ({ spotifyAuthUrl }) => (
  <Row justify="center">
    <Col span={24} md={12}>
      <Link href={spotifyAuthUrl}>Login with Spotify</Link>
    </Col>
  </Row>
);

export const getServerSideProps = withSession(async ({ req, query }) => {
  const { code } = query;
  const url = `${constants.BASE_URL}/api/login?code=${code || ''}`;
  const { spotifyAuthUrl = null, user: newUser = null } = await fetcher(url);

  if (newUser?.isLoggedIn) {
    console.log(newUser);
    req.session.set('user', newUser);
    await req.session.save();
  }

  const user = req.session.get('user');
  if (user && isFuture(new Date(user?.expiresIn))) {
    return {
      redirect: {
        destination: '/rooms',
        permanent: false,
      },
    };
  }

  return {
    props: {
      spotifyAuthUrl,
    },
  };
});

export default Login;
