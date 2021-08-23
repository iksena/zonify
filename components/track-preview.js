import { Children, useEffect, useState } from 'react';

import { isDOM } from '../lib/auth';

const TrackPreview = ({ url, children }) => {
  const [audio, setAudio] = useState();
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (isDOM(window)) {
      setAudio(new Audio(url));
    }
  }, [url]);

  useEffect(() => (playing ? audio?.play() : audio?.pause()), [playing, audio]);

  useEffect(() => {
    audio?.addEventListener('ended', () => setPlaying(false));

    return () => {
      audio?.removeEventListener('ended', () => setPlaying(false));
    };
  }, [audio]);

  if (!url) {
    return children;
  }

  return (
    <div
      style={{ cursor: 'pointer' }}
      onMouseEnter={() => setPlaying(true)}
      onMouseLeave={() => setPlaying(false)}
      onTouchStart={() => setPlaying(true)}
      onTouchEnd={() => setPlaying(false)}
    >
      {Children.only(children)}
    </div>
  );
};

export default TrackPreview;
