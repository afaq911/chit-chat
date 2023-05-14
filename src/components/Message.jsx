import React, { useEffect, useRef, useState } from "react";
import styles from "../styles/chat.module.css";
import DoneIcon from "@mui/icons-material/Done";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";
import Image from "next/image";
import moment from "moment";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import TestEmoji from "../utils/TestEmoji";
import AddMessageEmoji from "./AddMessageEmoji";
import { Emoji } from "emoji-picker-react";

const Message = ({ own, type, item, recieverId, setArrivalMessage }) => {
  const { data: session } = useSession();
  const MessageEmojiRef = useRef();
  const [isMessageEmoji, setisMessageEmoji] = useState(false);
  let MyReaction = item?.reacts?.find(
    (item) => item.senderId === session?.user?.email
  );
  const MessageRef = useRef();

  useEffect(() => {
    document.addEventListener("click", (e) => {
      if (MessageEmojiRef && !MessageEmojiRef.current?.contains(e.target)) {
        setisMessageEmoji(false);
      }
    });
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      whileInView={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0 }}
      ref={MessageRef}
    >
      <div
        className={`${styles.message_container_main} ${
          own ? styles.own_message : null
        } ${item?.reacts?.length ? styles.reactsMargin : null}`}
      >
        {type === 1 ? (
          <div className={styles.message_bx}>
            <div className={styles.inner_message_text}>
              <p className={TestEmoji(item?.message) ? styles.emojiText : null}>
                {item?.message}
              </p>
              <label></label>
            </div>
            <div className={styles.message_info_bx}>
              <p>{moment(item?.createdAt).format("hh:mm A")}</p>
              {own && (
                <div className={styles.Read_message_info}>
                  <div>
                    {(item?.isRecieved?.includes(session?.user?.email) &&
                      item?.isRecieved?.includes(recieverId)) ||
                    item?.isRead ? (
                      <DoneAllIcon
                        style={{ color: item?.isRead ? "#03BFFD" : "#fff" }}
                      />
                    ) : (
                      <DoneIcon style={{ color: "#fff" }} />
                    )}
                  </div>
                </div>
              )}
            </div>
            {item?.reacts?.length ? (
              <ReactionBxs item={item?.reacts} own={own} />
            ) : null}
          </div>
        ) : (
          <div
            className={`${styles.mainImageTypeMessage} ${
              !own && styles.mainImageTypeMessageNotOwn
            }`}
          >
            {item?.media?.map((image, index) => {
              return (
                <div className={styles.messae_bx_img} key={index}>
                  <Image src={image} alt="userImg" height="100%" width="100%" />
                  <div className={styles.message_info_bx}>
                    <p>{moment(item?.createdAt).format("hh:mm A")}</p>
                    {own && (
                      <div className={styles.Read_message_info}>
                        <div>
                          {(item?.isRecieved?.includes(session?.user?.email) &&
                            item?.isRecieved?.includes(recieverId)) ||
                          item?.isRead ? (
                            <DoneAllIcon
                              style={{
                                color: item?.isRead ? "#03BFFD" : "#fff",
                              }}
                            />
                          ) : (
                            <DoneIcon style={{ color: "#fff" }} />
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                  {item?.reacts?.length ? (
                    <ReactionBxs item={item?.reacts} own={own} />
                  ) : null}
                </div>
              );
            })}

            {item?.message && (
              <div className={styles.message_bx}>
                <div className={styles.inner_message_text}>
                  <p>{item?.message}</p>
                  <label></label>
                </div>
                <div className={styles.message_info_bx}>
                  <p>{moment(item?.createdAt).format("hh:mm A")}</p>
                  {own && (
                    <div className={styles.Read_message_info}>
                      <div>
                        {(item?.isRecieved?.includes(session?.user?.email) &&
                          item?.isRecieved?.includes(recieverId)) ||
                        item?.isRead ? (
                          <DoneAllIcon
                            style={{ color: item?.isRead ? "#03BFFD" : "#fff" }}
                          />
                        ) : (
                          <DoneIcon style={{ color: "#fff" }} />
                        )}
                      </div>
                    </div>
                  )}
                </div>
                {item?.reacts?.length ? (
                  <ReactionBxs item={item?.reacts} own={own} />
                ) : null}
              </div>
            )}
          </div>
        )}

        <div className={styles.message_react_dot}>
          <label onClick={() => setisMessageEmoji(true)} ref={MessageEmojiRef}>
            <EmojiEmotionsIcon />
          </label>
        </div>
        {isMessageEmoji && recieverId && (
          <AddMessageEmoji
            message={item}
            own={own}
            recieverId={recieverId}
            MyReaction={MyReaction}
            setArrivalMessage={setArrivalMessage}
          />
        )}
      </div>
    </motion.div>
  );
};

const ReactionBxs = ({ item }) => {
  return (
    <motion.div
      className={`${styles.messageReactions} `}
      initial={{ scale: 0 }}
      whileInView={{ scale: 1 }}
      exit={{ scale: 0 }}
    >
      {item?.map((data, index) => {
        return (
          <div
            className={styles.react_main_message}
            key={index}
            style={{ marginRight: index !== item?.length - 1 ? "5px" : "0px" }}
          >
            <Emoji unified={data?.reaction.unified} size={15} />
          </div>
        );
      })}
    </motion.div>
  );
};

export default Message;
