import {
  Row,
  Col,
  List,
} from 'antd';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import { getTokens } from '../../lib/auth';
import fetcher from '../../lib/fetcher';
import PlaylistItem from '../../components/playlist-item';

const Rooms = () => {
  const router = useRouter();
  const [playlists, setPlaylists] = useState([]);

  useEffect(() => {
    const { isExpired, accessToken } = getTokens(window);
    if (isExpired) {
      router.push('/');
    }

    const fetchPlaylist = async () => {
      const response = await fetcher(`http://localhost:3000/api/playlists?accessToken=${accessToken || ''}`);

      setPlaylists(response.body.items);
    };
    fetchPlaylist();
  }, [router]);

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

export default Rooms;
