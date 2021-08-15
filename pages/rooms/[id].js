import {
  Row,
  Col,
  List,
} from 'antd';

import fetcher from '../../lib/fetcher';
import withSession from '../../lib/session';

const Rooms = ({ tracks }) => (
  <Row>
    <Col span={24}>
      <List
        itemLayout="horizontal"
        dataSource={tracks}
        renderItem={({ track }) => (
          <List.Item>
            <List.Item.Meta
              title={track.name}
              description={track.artists?.reduce(
                (artist, { name }, index, { length }) => artist.concat(name, index < length - 1 ? ', ' : ''),
                '',
              )}
            />
          </List.Item>
        )}
      />
    </Col>
  </Row>
);

export const getServerSideProps = withSession(async ({ req, query }) => {
  const user = req.session.get('user');
  if (!user) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  const response = await fetcher(`http://localhost:3000/api/playlists/${query.id}?accessToken=${user.accessToken || ''}`);

  return {
    props: {
      tracks: response?.body?.tracks?.items ?? [],
    },
  };
});

export default Rooms;
