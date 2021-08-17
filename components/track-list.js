import { List } from 'antd';

const TrackList = ({ tracks }) => (
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
);

export default TrackList;
