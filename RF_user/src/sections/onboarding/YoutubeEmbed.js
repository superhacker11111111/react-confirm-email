import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

YoutubeEmbed.propTypes = {
  embedId: PropTypes.string,
};

export default function YoutubeEmbed({ embedId }) {
  const regex = /youtu\.be\/([A-Za-z0-9_-]+)/; // Regex to match the YouTube URL and capture the embedID
  const match = embedId.match(regex); // Apply the regex to the URL and get the match group
  let videoId = '';
  if (match) {
    videoId = match[1]; // Extract the embedID from the match group
  }
  const [aspectRatio, setAspectRatio] = useState(null);
  // const { embedId, ...other } = props;

  useEffect(() => {
    const handleResize = () => {
      const iframe = document.getElementById(`yt-${videoId}`);
      if (iframe) {
        const { width } = iframe.getBoundingClientRect();
        setAspectRatio(16 / 9);
        iframe.style.height = `${width / aspectRatio}px`;
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [aspectRatio, videoId]);
  return (
    <div style={{ position: 'relative', paddingTop: `${(aspectRatio * 100) / 3}%` }}>
      <iframe
        id={`yt-${videoId}`}
        src={`https://www.youtube.com/embed/${videoId}`}
        frameBorder="0"
        allowFullScreen
        title="YouTube video player"
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
      />
    </div>
  );
}
