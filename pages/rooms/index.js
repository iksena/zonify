import { Row, Col, Card } from 'antd';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import { getTokens } from '../../lib/auth';
import fetcher from '../../lib/fetcher';

const PlaylistItem = ({
  name,
  id,
  tracks,
  collaborative,
}) => (
  <Card title={name} bordered={false}>
    {`${id}\n${tracks.total}\n${collaborative}`}
  </Card>
);

const Rooms = () => {
  const router = useRouter();
  const [playlists, setPlaylists] = useState([]);

  useEffect(() => {
    const { isExpired, accessToken } = getTokens(window);
    if (isExpired) {
      router.push('/login');
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
        {playlists.map((item) => <PlaylistItem key={item.id} {...item} />)}
      </Col>
    </Row>
  );
};

export default Rooms;
