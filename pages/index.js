import {
  Row, Col, Typography, Button,
} from 'antd';
import { isFuture } from 'date-fns';
import Link from 'next/link';

import fetcher from '../lib/fetcher';
import withSession from '../lib/session';
import constants from '../constants';
import Header from '../components/header';

const { Text } = Typography;

const Login = ({ spotifyAuthUrl }) => (
  <>
    <Row justify="center">
      <Col span={24} md={12}>
        <Header />
      </Col>
    </Row>
    <Row justify="center" style={{ marginTop: 25 }}>
      <Link href={spotifyAuthUrl} passHref>
        <Button shape="round" style={{ fontSize: 18, color: '#1DB954' }}>Login with Spotify</Button>
      </Link>
    </Row>
    <Row justify="center">
      {!spotifyAuthUrl && <Text>Redirecting...</Text>}
    </Row>
  </>
);

export const getServerSideProps = withSession(async ({ req, query }) => {
  const { code, state } = query;
  const url = `${constants.BASE_URL}/api/login?code=${code || ''}&state=${state || ''}`;
  const { spotifyAuthUrl = null, user: newUser = null, path = '/rooms' } = await fetcher(url);

  if (newUser?.isLoggedIn) {
    console.log(newUser);
    req.session.set('user', newUser);
    await req.session.save();
  }

  const user = req.session.get('user');
  if (user && isFuture(new Date(user?.expiresIn))) {
    return {
      redirect: {
        destination: `${constants.BASE_URL}${path}`,
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
