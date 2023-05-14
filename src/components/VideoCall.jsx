import React, { useContext } from "react";
import styles from "../styles/videochat.module.css";
import Image from "next/image";
import { CallEnd, MicOff, VideocamOff } from "@mui/icons-material";
import { VideoCallContext } from "@/context/VideoCall";

const VideoCall = () => {
  const { MyVideo, setisVideo, setisAudio, isVideo, isAudio } =
    useContext(VideoCallContext);

  return (
    <div className={styles.mainVideoContainer}>
      <div className={styles.innerVideoChatMain}>
        <div className={styles.videoChatUsers}>
          <div className={styles.VideoUser}>
            <Image
              src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8dXNlcnxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=600&q=60"
              layout="fill"
              alt="UserImg"
            />
          </div>
          <div className={styles.VideoUser + " " + styles.MyVideo}>
            <video ref={MyVideo} autoPlay />
          </div>
        </div>
        <div className={styles.VideoCHatOptions}>
          <label
            className={styles.videoChatBtns}
            onClick={() => setisVideo(!isVideo)}
          >
            <VideocamOff />
          </label>
          <label
            className={styles.videoChatBtns}
            onClick={() => setisAudio(!isAudio)}
          >
            <MicOff />
          </label>
          <label className={styles.videoChatBtns + " " + styles.endCall}>
            <CallEnd />
          </label>
        </div>
      </div>
    </div>
  );
};

export default VideoCall;
