import {
  Row,
  Col,
  List,
  Radio,
  Avatar,
  Card,
} from 'antd';
import { isFuture } from 'date-fns';
import { useRouter } from 'next/router';
import Link from 'next/link';

import fetcher from '../lib/fetcher';
import withSession from '../lib/session';
import constants from '../constants';
import TrackList from '../components/track-list';
import Header from '../components/header';

const Top = ({ tracks, artists, isLoggedIn }) => {
  const router = useRouter();
  const goToTab = (tab) => `/top?term=${tab}`;

  return (
    <>
      <Row justify="center">
        <Col span={24}>
          <Header isLoggedIn={isLoggedIn} />
          <Card style={{ margin: 5 }}>
            Select time range:
            {' '}
            <Radio.Group value={router.query.term ?? '0'}>
              <Radio.Button value="0"><Link href={goToTab(0)} replace>4 weeks</Link></Radio.Button>
              <Radio.Button value="1"><Link href={goToTab(1)} replace>6 months</Link></Radio.Button>
              <Radio.Button value="2"><Link href={goToTab(2)} replace>All time</Link></Radio.Button>
            </Radio.Group>
          </Card>
        </Col>
      </Row>
      <Row justify="center">
        <Col span={24} md={12}>
          <Card style={{ margin: 5 }} title="Top Tracks">
            <TrackList tracks={tracks.map((item) => ({ track: item }))} />
          </Card>
        </Col>
        <Col span={18} md={12}>
          <Card style={{ margin: 5 }} title="Top Artists">
            <List
              itemLayout="horizontal"
              dataSource={artists}
              renderItem={({
                name, genres, images, id,
              }) => (
                <Link href={`/artists/${id}`} passHref>
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
                </Link>
              )}
            />
          </Card>
        </Col>
      </Row>
    </>
  );
};

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

  const { term = 0 } = query;
  const { body: { items: tracks } } = await fetcher(`${constants.BASE_URL}/api/top/tracks?term=${term}&accessToken=${user.accessToken || ''}`);
  const { body: { items: artists } } = await fetcher(`${constants.BASE_URL}/api/top/artists?term=${term}&accessToken=${user.accessToken || ''}`);

  return {
    props: {
      tracks,
      artists,
      isLoggedIn,
    },
  };
});

export default Top;
