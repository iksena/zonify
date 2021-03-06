import { Children, useEffect, useState } from 'react';

export const isDOM = (window) => typeof window !== 'undefined';

const useAudio = (url) => {
  const [audio, setAudio] = useState();
  const [playing, setPlaying] = useState(false);
  const pause = () => setPlaying(false);

  useEffect(() => {
    if (isDOM(window)) {
      setAudio(new Audio(url));
    }
  }, [url]);

  useEffect(() => (playing ? audio?.play() : audio?.pause()), [playing, audio]);

  useEffect(() => {
    audio?.addEventListener('ended', pause);

    return () => {
      audio?.removeEventListener('ended', pause);
      audio?.pause();
    };
  }, [audio]);

  return {
    playing,
    pause,
    play: () => setPlaying(true),
    toggle: () => setPlaying((isPlaying) => !isPlaying),
  };
};

const TrackPreview = ({ url, children, autoplay = true }) => {
  const { play, pause, toggle } = useAudio(url);

  if (!url) {
    return children;
  }

  return (
    <div
      style={{ cursor: 'none', marginBottom: 5 }}
      {...autoplay && {
        onMouseEnter: play,
        onMouseLeave: pause,
        onTouchStart: play,
        onTouchEnd: pause,
      }}
      role="menuitem"
      onClick={toggle}
      tabIndex={0}
      onKeyDown={(e) => e.code === 'Space' && toggle()}
    >
      {Children.only(children)}
    </div>
  );
};

export default TrackPreview;
