import {
  Row,
  Col,
  List,
} from 'antd';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import { getTokens } from '../../lib/auth';
import fetcher from '../../lib/fetcher';

const Rooms = () => {
  const router = useRouter();
  const [tracks, setTracks] = useState([]);

  useEffect(() => {
    const { isExpired, accessToken } = getTokens(window);
    if (isExpired) {
      router.push('/');
    }

    const fetchPlaylist = async () => {
      const response = await fetcher(`http://localhost:3000/api/playlists/${router.query.id}?accessToken=${accessToken || ''}`);

      setTracks(response?.body?.tracks?.items ?? []);
    };
    fetchPlaylist();
  }, [router]);

  return (
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
};

export default Rooms;
