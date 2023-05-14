import React, { useState } from "react";
import styles from "../styles/messageemoji.module.css";
import { Emoji } from "emoji-picker-react";
import { axiosinstance } from "@/utils/axiosinstance";
import { useSession } from "next-auth/react";
import socket from "@/utils/socket";

const AddMessageEmoji = ({
  message,
  own,
  recieverId,
  MyReaction,
  setArrivalMessage,
}) => {
  const { data: session } = useSession();
  const [emojisArray, setEmojisArray] = useState([
    { unified: "1f923", emoji: "🤣" },
    { unified: "1f44d-1f3fb", emoji: "👍🏻" },
    { unified: "2764-fe0f", emoji: "❤️" },
    { unified: "1f620", emoji: "😠" },
    { unified: "1f62d", emoji: "😭" },
  ]);

  const HandleAddReaction = async (item) => {
    try {
      const res = await axiosinstance.post("/reactions", {
        messageId: message?._id,
        senderId: session?.user?.email,
        reaction: item,
      });

      setArrivalMessage(res.data);

      socket.emit("SendMessage", {
        recieverId: recieverId,
        message: res.data,
      });
    } catch (e) {
      console.log(e);
    }
  };

  const HandleRemoveReaction = async () => {
    try {
      const res = await axiosinstance.post("/reactions/delete", {
        messageId: message?._id,
        senderId: session?.user?.email,
      });

      setArrivalMessage(res.data);

      socket.emit("SendMessage", {
        recieverId: recieverId,
        message: res.data,
      });
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div
      className={`${
        !own ? styles.ownmainEmojiContainer : styles.mainEmojiContainer
      }`}
    >
      <div className={styles.innerEmojiMessage}>
        {emojisArray?.map((item, index) => {
          return (
            <div
              className={`${styles.emojiMessage} ${
                MyReaction?.reaction.unified === item?.unified
                  ? styles.highlishEmoji
                  : null
              }`}
              key={index}
              onClick={() => {
                if (MyReaction?.reaction.unified === item?.unified) {
                  HandleRemoveReaction();
                } else {
                  HandleAddReaction(item);
                }
              }}
            >
              <Emoji unified={item?.unified} />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AddMessageEmoji;
