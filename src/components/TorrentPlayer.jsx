import React, { useState, useEffect, useRef } from 'react';
import styles from './TorrentPlayer.module.css';

const TorrentPlayer = ({ magnet, onClose }) => {
  const [status, setStatus] = useState('loading');
  const [progress, setProgress] = useState(0);
  const [speed, setSpeed] = useState(0);
  const [peers, setPeers] = useState(0);
  const [error, setError] = useState(null);
  const videoRef = useRef(null);
  const clientRef = useRef(null);

  useEffect(() => {
    if (!magnet) return;

    const loadWebTorrent = async () => {
      try {
        setStatus('loading');
        
        // Dynamic import for WebTorrent (browser version)
        const WebTorrent = (await import('webtorrent/dist/webtorrent.min.js')).default;
        
        const client = new WebTorrent();
        clientRef.current = client;

        client.add(magnet, { announce: [
          'wss://tracker.openwebtorrent.com',
          'wss://tracker.btorrent.xyz',
          'wss://tracker.fastcast.nz'
        ]}, (torrent) => {
          setStatus('downloading');
          
          // Find the video file
          const videoFile = torrent.files.find(f => 
            f.name.endsWith('.mp4') || 
            f.name.endsWith('.mkv') || 
            f.name.endsWith('.avi') ||
            f.name.endsWith('.webm')
          );

          if (!videoFile) {
            setError('No video file found in torrent');
            setStatus('error');
            return;
          }

          // Stream to video element
          videoFile.renderTo(videoRef.current, { autoplay: true }, (err) => {
            if (err) {
              setError(err.message);
              setStatus('error');
            }
          });

          // Update progress
          torrent.on('download', () => {
            setProgress(Math.round(torrent.progress * 100));
            setSpeed(Math.round(torrent.downloadSpeed / 1024));
            setPeers(torrent.numPeers);
          });

          torrent.on('done', () => {
            setStatus('ready');
            setProgress(100);
          });
        });

        client.on('error', (err) => {
          setError(err.message);
          setStatus('error');
        });

      } catch (err) {
        setError(err.message);
        setStatus('error');
      }
    };

    loadWebTorrent();

    return () => {
      if (clientRef.current) {
        clientRef.current.destroy();
      }
    };
  }, [magnet]);

  return (
    <div className={styles.overlay}>
      <div className={styles.container}>
        <button className={styles.closeBtn} onClick={onClose}>✕</button>
        
        {status === 'loading' && (
          <div className={styles.loading}>
            <div className={styles.spinner} />
            <p>Connecting to peers...</p>
          </div>
        )}

        {status === 'error' && (
          <div className={styles.error}>
            <p>❌ Error: {error}</p>
            <button onClick={onClose}>Close</button>
          </div>
        )}

        {(status === 'downloading' || status === 'ready') && (
          <>
            <video 
              ref={videoRef} 
              className={styles.video}
              controls 
              autoPlay
            />
            <div className={styles.stats}>
              <span>📥 {progress}%</span>
              <span>⚡ {speed} KB/s</span>
              <span>👥 {peers} peers</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default TorrentPlayer;
