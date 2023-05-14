import React, { useEffect, useRef, useState } from "react";
import styles from "../styles/attach.module.css";
import CloseIcon from "@mui/icons-material/Close";
import Image from "next/image";
import AddIcon from "@mui/icons-material/Add";
import SendBtn from "./SendBtn";
import { motion } from "framer-motion";
import { UploadMedia } from "../utils/UploadMedia";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import { axiosinstance } from "../utils/axiosinstance";
import socket from "../utils/socket";
import { useSession } from "next-auth/react";

const Attachments = ({
  data,
  setnewAttachments,
  setUploadedImgs,
  UploadedImgs,
  isRecieverOnline,
  isReadAble,
  setMessages,
  recieverId,
  CurrentCon,
}) => {
  const { data: session } = useSession();
  const [message, setMessage] = useState();
  const [showImg, setShowImg] = useState(0);
  const [progress, setProgress] = useState();
  const [loading, setLoading] = useState(false);
  const Input_ref = useRef();

  const OnSuccess = (item) => {
    let ItemId = Object.keys(item)[0];
    setUploadedImgs((prev) => [...prev, item[ItemId]]);
  };

  const GetProgress = (item) => {
    setProgress((prev) => ({ ...prev, ...item }));
  };

  const HandleAttchments = (e) => {
    let files = e.target.files;
    Object.entries(files)?.map((item) => {
      setnewAttachments((prev) => [...prev, item[1]]);
    });
  };

  const RemoveAttchment = (val) => {
    setnewAttachments(data?.filter((item) => item !== val));
    let newShowImg = showImg - 1;
    data?.indexOf(val) === showImg && setShowImg(newShowImg);
    data?.indexOf(val) === 0 && setShowImg((prev) => prev + 1);
  };

  const HandleSendMessage = async () => {
    data?.map((item) => {
      let Image = item;
      Image["id"] = item?.name;
      if (Image) {
        UploadMedia({ File: Image, GetProgress, OnSuccess });
      }
    });
  };

  useEffect(() => {
    const HandleUploadMessage = async () => {
      setLoading(true);
      try {
        const res = await axiosinstance.post("/messages", {
          conversationId: CurrentCon?._id,
          senderId: session?.user?.email,
          media: UploadedImgs,
          message,
          isRecieved: isRecieverOnline
            ? [session?.user?.email, recieverId]
            : [session?.user?.email],
          isRead: isReadAble,
          type: 2,
        });

        socket.emit("SendMessage", {
          recieverId: recieverId,
          message: res.data,
        });

        setMessages((prev) => [...prev, res.data]);
        setMessage("");
        Input_ref.current.value = "";
        setLoading(false);
        setnewAttachments([]);
        setUploadedImgs([]);
      } catch (err) {
        console.log(err);
        setLoading(false);
      }
    };

    if (UploadedImgs?.length === data?.length) {
      HandleUploadMessage();
      setProgress();
    }
  }, [
    UploadedImgs,
    data,
    CurrentCon,
    isReadAble,
    isRecieverOnline,
    message,
    recieverId,
    session?.user,
    setMessages,
    setUploadedImgs,
    setnewAttachments,
  ]);

  useEffect(() => {
    const listener = (event) => {
      if (event.code === "Enter" || event.code === "NumpadEnter") {
        event.preventDefault();
        HandleSendMessage();
      }
    };
    document.addEventListener("keydown", listener);
    return () => {
      document.removeEventListener("keydown", listener);
    };
  }, [message]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className={styles.mainAttchmentContainer}>
        <div className={styles.innerAttachments}>
          <div className={styles.attachmentsHeader}>
            <div
              className={styles.closeIcon}
              onClick={() => {
                setnewAttachments([]);
                setUploadedImgs([]);
              }}
            >
              <CloseIcon />
            </div>
          </div>

          <div className={styles.mediaDisplay}>
            <div className={styles.dataViewCard}>
              <Image
                src={data[showImg] && URL.createObjectURL(data[showImg])}
                alt="Img"
                className={styles.imageMainDispaly}
                layout="fill"
              />
            </div>
            <div className={styles.inputBx}>
              <input
                ref={Input_ref}
                type="text"
                placeholder="Type Message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>
          </div>

          <div className={styles.mainAttachmentDatas}>
            <div className={styles.attachmentsData}>
              {data?.map((item, index) => {
                return (
                  <>
                    <div
                      className={`${styles.singleAttachment}  ${
                        showImg === index ? styles.activeSingleAttchment : null
                      }`}
                      key={index + 1}
                    >
                      <div
                        className={styles.attachentCloseIcon}
                        onClick={() => RemoveAttchment(item)}
                      >
                        <CloseIcon />
                      </div>
                      <div onClick={() => setShowImg(index)}>
                        <Image
                          src={URL.createObjectURL(item)}
                          alt="Img"
                          layout="fill"
                        />
                      </div>
                    </div>
                  </>
                );
              })}
              <div className={styles.singleAttachment}>
                <label htmlFor="AttachmenntImgs">
                  <AddIcon />
                </label>
                <input
                  type="file"
                  multiple
                  id="AttachmenntImgs"
                  onChange={HandleAttchments}
                />
              </div>
            </div>
            <div className={styles.sendMessageBtn}>
              <label onClick={HandleSendMessage}>
                {!progress && data?.length > 1 ? (
                  <span className={styles.sendBadge}>{data?.length}</span>
                ) : null}

                {progress || loading ? (
                  <Box sx={{ display: "flex", color: "white" }}>
                    <CircularProgress size={30} color="inherit" />
                  </Box>
                ) : (
                  <div className={styles.svgSendIcon}>
                    <SendBtn />
                  </div>
                )}
              </label>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Attachments;
