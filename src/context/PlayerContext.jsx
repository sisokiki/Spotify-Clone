import { createContext, useEffect, useRef, useState } from "react";
import { songsData } from "../assets/assets"; //

export const PlayerContext = createContext();

const PlayerContextProvider = (props) => {
  const audioRef = useRef();
  const seekBg = useRef();
  const seekBar = useRef();

  const [track, setTrack] = useState(songsData[0]);
  const [playStatus, setPlayStatus] = useState(false);
  const [time, setTime] = useState({
    currentTime: { second: 0, minute: 0 },
    totalTime: { second: 0, minute: 0 },
  });

  const play = () => {
    audioRef.current.play();
    setPlayStatus(true);
  };

  const pause = () => {
    audioRef.current.pause();
    setPlayStatus(false);
  };

  
  const playWithId = async (id) => {
    setTrack(songsData[id]);
  };

  const previous = async () => {
    if (track.id > 0) {
      setTrack(songsData[track.id - 1]);
    }
  };

  const next = async () => {
    if (track.id < songsData.length - 1) {
      setTrack(songsData[track.id + 1]);
    }
  };

  const seekSong = async (e) => {
    if (!audioRef.current || !audioRef.current.duration) return;
    audioRef.current.currentTime =
      (e.nativeEvent.offsetX / seekBg.current.offsetWidth) *
      audioRef.current.duration;
  };

  
  useEffect(() => {
    if (audioRef.current && track.file) {
      
      audioRef.current.load();
      audioRef.current.play()
        .then(() => setPlayStatus(true))
        .catch((err) => console.log("Playback interrupted:", err));
    }
  }, [track]); 

  // 
  useEffect(() => {
    if (!audioRef.current) return;

    const updateTime = () => {
      const duration = audioRef.current.duration || 0;
      
      if (seekBar.current) {
        seekBar.current.style.width = 
          Math.floor((audioRef.current.currentTime / duration) * 100) + "%";
      }

      setTime({
        currentTime: {
          second: Math.floor(audioRef.current.currentTime % 60),
          minute: Math.floor(audioRef.current.currentTime / 60),
        },
        totalTime: {
          second: Math.floor(duration % 60),
          minute: Math.floor(duration / 60),
        },
      });
    };

    audioRef.current.ontimeupdate = updateTime;

    return () => {
      if (audioRef.current) audioRef.current.ontimeupdate = null;
    };
  }, [track]); 

  const contextValue = {
    audioRef,
    seekBar,
    seekBg,
    track,
    setTrack,
    playStatus,
    setPlayStatus,
    time,
    setTime,
    play,
    pause,
    playWithId,
    previous,
    next,
    seekSong,
  };

  return (
    <PlayerContext.Provider value={contextValue}>
      {props.children}
    </PlayerContext.Provider>
  );
};

export default PlayerContextProvider;