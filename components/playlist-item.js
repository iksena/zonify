import { PlayCircleOutlined } from '@ant-design/icons';
import { Button, Card } from 'antd';

const PlaylistItem = ({
  name,
  description,
  images,
  onPress,
  id,
}) => (
  <Card
    hoverable
    style={{ margin: 25 }}
    cover={<img alt={name} src={images?.[0]?.url} />}
    actions={[
      <Button key={id} type="primary" shape="round" icon={<PlayCircleOutlined />} onClick={onPress} />,
    ]}
  >
    <Card.Meta title={name} description={description} />
  </Card>
);

export default PlaylistItem;
