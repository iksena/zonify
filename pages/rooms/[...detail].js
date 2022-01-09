import {
  Row,
  Col,
  Menu,
  Input,
  Card,
} from 'antd';
import { isFuture } from 'date-fns';
import { useRouter } from 'next/router';
import Link from 'next/link';

import fetcher from '../../lib/fetcher';
import withSession from '../../lib/session';
import supabase from '../../lib/supabase';
import constants from '../../constants';
import TrackList from '../../components/track-list';
import Header from '../../components/header';

const MENU = {
  TRACKS: 'tracks',
  SEARCH: 'search',
};

const Detail = ({
  baseUrl,
  accessToken,
  name,
  tracks,
  isLoggedIn,
}) => {
  const router = useRouter();
  const { detail: [id, menu] } = router.query;
  const isSearchMenu = menu === MENU.SEARCH;
  const baseLocation = `/rooms/${id}`;

  const onAddTrack = (track) => async () => {
    await fetcher(`${baseUrl}/api/playlists/${id}/add?track=${track}&accessToken=${accessToken || ''}`);

    router.replace(`${baseLocation}/${MENU.TRACKS}`);
  };

  return (
    <Row justify="center">
      <Col span={24} md={12}>
        <Header isLoggedIn={isLoggedIn} />
        <Card title={name}>
          <Menu selectedKeys={menu || MENU.TRACKS} mode="horizontal">
            <Menu.Item key={MENU.TRACKS}><Link href={`/rooms/${id}/${MENU.TRACKS}`} replace>Tracks</Link></Menu.Item>
            <Menu.Item key={MENU.SEARCH}><Link href={`/rooms/${id}/${MENU.SEARCH}`} replace>Search</Link></Menu.Item>
          </Menu>
          {isSearchMenu && (
          <Input.Search
            placeholder="Search a song"
            onSearch={(q) => router.replace(`${baseLocation}/${MENU.SEARCH}/?q=${q}`)}
            enterButton
          />
          )}
          <TrackList tracks={tracks} {...isSearchMenu && { onAdd: onAddTrack }} />
        </Card>
      </Col>
    </Row>
  );
};

const _mapTracksResponse = (response) => {
  const body = response?.body ?? {};
  const tracks = body.tracks ?? {};

  return {
    name: body.name ?? '',
    ownerId: body.owner?.id ?? '',
    collaborative: body.collaborative ?? false,
    public: body.public ?? false,
    image: body.images?.[0]?.url ?? '',
    tracks: tracks.items ?? [],
    total: tracks.total ?? 0,
    offset: tracks.offset ?? 0,
    limit: tracks.limit ?? 0,
  };
};

const _mapSearchResponse = (response) => {
  const body = response?.body ?? {};
  const tracks = body.tracks ?? {};
  const searchResult = tracks.items?.map((item) => ({ track: item })) ?? [];

  return {
    tracks: searchResult,
    total: tracks.total ?? 0,
    offset: tracks.offset ?? 0,
    limit: tracks.limit ?? 0,
  };
};

export const getServerSideProps = withSession(async ({ req, query, resolvedUrl }) => {
  const { detail: [id, path], q } = query;
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

  const { accessToken } = user;
  const defaultProps = {
    accessToken,
    baseUrl: constants.BASE_URL,
  };

  const result = await fetcher(`${constants.BASE_URL}/api/playlists/${id}?accessToken=${accessToken || ''}`);
  const playlist = _mapTracksResponse(result);
  await supabase.saveRoom({
    id,
    name: playlist.name,
    userId: playlist.ownerId,
  });

  if (path === MENU.SEARCH) {
    const searchResult = !!q && await fetcher(`${constants.BASE_URL}/api/search?query=${q}&accessToken=${accessToken || ''}`);

    return {
      props: {
        ...defaultProps,
        ...playlist,
        ..._mapSearchResponse(searchResult),
        isLoggedIn,
      },
    };
  }

  return {
    props: {
      ...defaultProps,
      ...playlist,
      isLoggedIn,
    },
  };
});

export default Detail;
