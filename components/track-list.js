import { Button, List } from 'antd';
import { AppstoreAddOutlined } from '@ant-design/icons';

const TrackList = ({ tracks, onAdd }) => (
  <List
    itemLayout="horizontal"
    dataSource={tracks}
    renderItem={({ track, fromSearch }) => (
      <List.Item
        actions={[
          fromSearch && <Button key="Add" type="primary" shape="round" icon={<AppstoreAddOutlined />} onClick={onAdd(track.uri)} />,
        ]}
      >
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
);

export default TrackList;
