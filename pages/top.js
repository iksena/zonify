import {
  Row,
  Col,
  List,
  Radio,
  Avatar,
} from 'antd';
import { isPast } from 'date-fns';
import { useRouter } from 'next/router';

import fetcher from '../lib/fetcher';
import withSession from '../lib/session';
import constants from '../constants';
import TrackList from '../components/track-list';

const Rooms = ({ tracks, artists }) => {
  const router = useRouter();

  return (
    <>
      <Row justify="center">
        <Col span={24}>
          <Radio.Group onChange={({ target: { value } }) => router.replace(`/top?term=${value}`)} defaultValue={router.query.term ?? '0'}>
            <Radio.Button value="0">4 weeks</Radio.Button>
            <Radio.Button value="1">6 months</Radio.Button>
            <Radio.Button value="2">All time</Radio.Button>
          </Radio.Group>
        </Col>
      </Row>
      <Row justify="center">
        <Col span={24} md={12}>
          <TrackList tracks={tracks.map((item) => ({ track: item }))} />
        </Col>
        <Col span={24} md={12}>
          <List
            itemLayout="horizontal"
            dataSource={artists}
            renderItem={({ name, genres, images }) => (
              <List.Item>
                <List.Item.Meta
                  avatar={<Avatar src={images[0]?.url} />}
                  title={name}
                  description={genres.reduce(
                    (genre, label, index, { length }) => genre.concat(label, index < length - 1 ? ', ' : ''),
                    '',
                  )}
                />
              </List.Item>
            )}
          />
        </Col>
      </Row>
    </>
  );
};

export const getServerSideProps = withSession(async ({ req, query }) => {
  const user = req.session.get('user');
  if (!user || isPast(new Date(user?.expiresIn))) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  const { term = 0 } = query;
  const { body: { items: tracks } } = await fetcher(`${constants.BASE_URL}/api/top/tracks?term=${term}&accessToken=${user.accessToken || ''}`);
  const { body: { items: artists } } = await fetcher(`${constants.BASE_URL}/api/top/artists?term=${term}&accessToken=${user.accessToken || ''}`);

  return {
    props: {
      tracks,
      artists,
    },
  };
});

export default Rooms;
