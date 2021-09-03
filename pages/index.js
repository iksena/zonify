import { Row, Col } from 'antd';
import { isFuture } from 'date-fns';
import Link from 'next/link';

import fetcher from '../lib/fetcher';
import withSession from '../lib/session';
import constants from '../constants';
import Header from '../components/header';

const followButtonIframe = '<iframe src="https://open.spotify.com/follow/1/?uri=spotify:user:pqu0x4kwjlnmj2di1t695cnlm?si=c4b04787c0b34021&size=detail&theme=light" width="300" height="56" scrolling="no" frameborder="0" style="border:none; overflow:hidden;" allowtransparency="true"></iframe>';

const Login = ({ spotifyAuthUrl }) => (
  <Row justify="center">
    <Col span={24} md={12}>
      <Header />
      <Link href={spotifyAuthUrl}>Login with Spotify</Link>
      <div dangerouslySetInnerHTML={{ __html: followButtonIframe }} />
    </Col>
  </Row>
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
