import { createContext, useContext, useEffect, useRef, useState } from "react";

export const VideoCallContext = createContext();

const VideoCallProvider = ({ children }) => {
  const [isVideo, setisVideo] = useState(true);
  const [isAudio, setisAudio] = useState(true);
  const MyVideo = useRef();

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: isVideo, audio: isAudio })
      .then((stream) => {
        MyVideo.current.srcObject = stream;
      });
  }, []);

  return (
    <VideoCallContext.Provider
      value={{
        MyVideo,
        isVideo,
        isAudio,
        setisVideo,
        setisAudio,
      }}
    >
      {children}
    </VideoCallContext.Provider>
  );
};

export default VideoCallProvider;
