import {
  Row,
  Col,
  List,
} from 'antd';
import { isPast } from 'date-fns';
import { useRouter } from 'next/router';

import fetcher from '../../lib/fetcher';
import PlaylistItem from '../../components/playlist-item';
import withSession from '../../lib/session';
import constants from '../../constants';

const Rooms = ({ playlists }) => {
  const router = useRouter();

  return (
    <Row justify="center">
      <Col span={24} md={12}>
        <List
          grid={{
            gutter: 16,
            xs: 1,
            sm: 2,
            md: 2,
            lg: 2,
            xl: 2,
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
  if (!user || isPast(new Date(user?.expiresIn))) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  const response = await fetcher(`${constants.BASE_URL}/api/playlists?accessToken=${user.accessToken || ''}`);

  return {
    props: {
      playlists: response?.body?.items,
    },
  };
});

export default Rooms;
