import { Button, List } from 'antd';
import { AppstoreAddOutlined } from '@ant-design/icons';
import Link from 'next/link';

import TrackPreview from './track-preview';

const TrackList = ({ tracks, onAdd }) => (
  <List
    itemLayout="horizontal"
    dataSource={tracks}
    renderItem={({ track }) => (
      <TrackPreview url={track.preview_url} key={track.id}>
        <List.Item
          actions={[
            onAdd && <Button key="Add" type="primary" shape="round" icon={<AppstoreAddOutlined />} onClick={onAdd?.(track.uri)} />,
          ]}
        >
          <List.Item.Meta
            title={track.name}
            description={track.artists?.map(({ name, id }, index, { length }) => (
              <span key={id}>
                <Link href={`/artists/${id}`}>{name}</Link>
                {index < length - 1 ? ', ' : ''}
              </span>
            ))}
          />
        </List.Item>
      </TrackPreview>
    )}
  />
);

export default TrackList;
