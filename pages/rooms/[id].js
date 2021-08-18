import {
  Row,
  Col,
  Divider,
  Menu,
  Input,
} from 'antd';
import { isPast } from 'date-fns';
import { useState } from 'react';
import { useRouter } from 'next/router';

import fetcher from '../../lib/fetcher';
import withSession from '../../lib/session';
import constants from '../../constants';
import TrackList from '../../components/track-list';

const MENU = {
  TRACKS: 'tracks',
  SEARCH: 'search',
};

const _fetchPlaylistTracks = async (playlistUrl) => {
  const response = await fetcher(playlistUrl);

  const body = response?.body ?? {};
  const tracks = body.tracks ?? {};
  console.log(tracks.items);

  return {
    name: body.name ?? '',
    collaborative: body.collaborative ?? false,
    public: body.public ?? false,
    image: body.images?.[0]?.url ?? '',
    tracks: tracks.items ?? [],
    total: tracks.total ?? 0,
    offset: tracks.offset ?? 0,
    limit: tracks.limit ?? 0,
  };
};

const Rooms = (props) => {
  const router = useRouter();
  const [menu, setMenu] = useState(MENU.TRACKS);
  const [tracks, setTracks] = useState(props.tracks);

  const fetchPlaylist = async () => {
    const result = await _fetchPlaylistTracks(props.playlistUrl);

    setTracks(result?.tracks);
  };

  const fetchSearch = ({ baseUrl, accessToken }) => async (query) => {
    const result = await fetcher(`${baseUrl}/api/search?query=${query}&accessToken=${accessToken || ''}`);
    const trackResult = result?.body?.tracks?.items ?? [];

    setTracks(trackResult.map((item) => ({ track: item, fromSearch: true })));
  };

  const navigateMenu = ({ key }) => {
    setTracks([]);
    if (key === MENU.TRACKS) fetchPlaylist();
    setMenu(key);
  };

  const onAddTrack = (track) => async () => {
    await fetcher(`${props.baseUrl}/api/playlists/${router.query.id}/add?track=${track}&accessToken=${props.accessToken || ''}`);

    navigateMenu({ key: MENU.TRACKS });
  };

  return (
    <Row justify="center">
      <Col span={24} md={12}>
        <Divider orientation="left">{props.name}</Divider>
        <Menu selectedKeys={[menu]} onClick={navigateMenu} mode="horizontal">
          <Menu.Item key={MENU.TRACKS}>Tracks</Menu.Item>
          <Menu.Item key={MENU.SEARCH}>Search</Menu.Item>
        </Menu>
        {menu === MENU.SEARCH && <Input.Search placeholder="Search a song" onSearch={fetchSearch(props)} enterButton />}
        <TrackList tracks={tracks} onAdd={onAddTrack} />
      </Col>
    </Row>
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

  const playlistUrl = `${constants.BASE_URL}/api/playlists/${query.id}?accessToken=${user.accessToken || ''}`;
  const playlistData = await _fetchPlaylistTracks(playlistUrl);

  return {
    props: {
      accessToken: user.accessToken,
      baseUrl: constants.BASE_URL,
      playlistUrl,
      ...playlistData,
    },
  };
});

export default Rooms;
