import {
  Row,
  Col,
  Card,
} from 'antd';
import { isFuture } from 'date-fns';

import fetcher from '../../lib/fetcher';
import withSession from '../../lib/session';
import constants from '../../constants';
import TrackList from '../../components/track-list';
import Header from '../../components/header';

const Rooms = ({ tracks, isLoggedIn }) => (
  <Row justify="center">
    <Col span={24} md={12}>
      <Header isLoggedIn={isLoggedIn} />
      <Card style={{ margin: 5 }} title="Top Tracks">
        <TrackList tracks={tracks.map((item) => ({ track: item }))} />
      </Card>
    </Col>
  </Row>
);

export const getServerSideProps = withSession(async ({ req, query, resolvedUrl }) => {
  const user = req.session.get('user');
  const isLoggedIn = !!user && isFuture(new Date(user?.expiresIn));
  if (!isLoggedIn) {
    return {
      redirect: {
        destination: `/?state=${resolvedUrl}`,
        permanent: false,
      },
    };
  }

  const { body: { tracks = [] } } = await fetcher(`${constants.BASE_URL}/api/artists/${query.id}?accessToken=${user.accessToken || ''}`);

  return {
    props: {
      tracks,
      isLoggedIn,
    },
  };
});

export default Rooms;
