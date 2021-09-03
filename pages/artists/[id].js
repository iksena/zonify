import {
  Row,
  Col,
  Card,
} from 'antd';
import { isPast } from 'date-fns';

import fetcher from '../../lib/fetcher';
import withSession from '../../lib/session';
import constants from '../../constants';
import TrackList from '../../components/track-list';
import Header from '../../components/header';

const Rooms = ({ tracks }) => (
  <Row justify="center">
    <Col span={24} md={12}>
      <Header />
      <Card style={{ margin: 5 }} title="Top Tracks">
        <TrackList tracks={tracks.map((item) => ({ track: item }))} />
      </Card>
    </Col>
  </Row>
);

export const getServerSideProps = withSession(async ({ req, query, resolvedUrl }) => {
  const user = req.session.get('user');
  if (!user || isPast(new Date(user?.expiresIn))) {
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
    },
  };
});

export default Rooms;
