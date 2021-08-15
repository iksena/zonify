import {
  Row,
  Col,
  List,
} from 'antd';
import { useRouter } from 'next/router';

import fetcher from '../../lib/fetcher';
import PlaylistItem from '../../components/playlist-item';
import withSession from '../../lib/session';

const Rooms = ({ playlists }) => {
  const router = useRouter();

  return (
    <Row>
      <Col span={24}>
        <List
          grid={{
            gutter: 16,
            xs: 1,
            sm: 2,
            md: 4,
            lg: 4,
            xl: 6,
            xxl: 3,
          }}
          split
          dataSource={playlists}
          renderItem={(item) => (
            <PlaylistItem
              {...item}
              key={item.id}
              onPress={() => router.push(`/rooms/${item.id}`)}
            />
          )}
        />
      </Col>
    </Row>
  );
};

export const getServerSideProps = withSession(async ({ req }) => {
  const user = req.session.get('user');
  if (!user) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  const response = await fetcher(`http://localhost:3000/api/playlists?accessToken=${user.accessToken || ''}`);

  return {
    props: {
      playlists: response?.body?.items,
    },
  };
});

export default Rooms;
