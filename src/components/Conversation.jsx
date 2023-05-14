import React, { useContext } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import styles from "../styles/chat.module.css";
import { GetReciever } from "../utils/GetReciever";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { axiosinstance } from "../utils/axiosinstance";
import { useState } from "react";
import { ChatContext } from "../context/chat";
import moment from "moment";
import CollectionsIcon from "@mui/icons-material/Collections";
import DoneIcon from "@mui/icons-material/Done";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import SkeltonConversation from "./SkelonConversation";

const Conversation = ({ item, GetConversation, isActive, isTyping }) => {
  const { data: session } = useSession();
  const [recieverId, setrecieverId] = useState();
  const [User, setUser] = useState();
  const [lastMessage, setLastMessage] = useState();
  const [unread, setUnread] = useState();
  const { Online } = useContext(ChatContext);
  const isOnline = Online?.some((item) => item?.email === recieverId);
  let own = lastMessage && lastMessage.senderId === session?.user?.email;
  let isDoubleTick =
    (lastMessage?.isRecieved?.includes(session?.user?.email) &&
      lastMessage?.isRecieved?.includes(recieverId)) ||
    lastMessage?.isRead;

  useEffect(() => {
    const GetReciever = async () => {
      try {
        const res = await axiosinstance.get(`/user/${recieverId}`);
        setUser(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    session?.user && recieverId && GetReciever();
  }, [recieverId, session]);

  useEffect(() => {
    const GetLastMessage = async () => {
      try {
        const res = await axiosinstance.get(`/messages/last/${item?._id}`);
        setLastMessage(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    GetLastMessage();
  }, [item]);

  useEffect(() => {
    const GetUnreadMessages = async () => {
      try {
        const res = await axiosinstance.post(`/messages/unread/${item?._id}`, {
          senderId: session?.user?.email,
        });
        setUnread(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    GetUnreadMessages();
  }, [item]);

  useEffect(() => {
    item &&
      session?.user?.email &&
      setrecieverId(
        GetReciever({ data: item?.users, me: session?.user?.email })
      );
  }, [session?.user?.email, item]);

  return (
    <>
      {User ? (
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className={`${styles.conversation} Fd_Name ${
            isActive && styles.activeconversation
          }`}
          onClick={() => GetConversation(item)}
        >
          <div className={styles.conversation_img}>
            <div className={styles.inner_container_img}>
              <Image
                src={
                  User?.profilepic
                    ? User?.profilepic
                    : "https://hope.be/wp-content/uploads/2015/05/no-user-image.gif"
                }
                alt="userImg"
                height="100%"
                width="100%"
                style={{ borderRadius: "50%" }}
              />
              {isOnline && <div className={styles.onlineStat}></div>}
            </div>
          </div>
          <div className={styles.conversation_details}>
            <div className={styles.conversation_user_info}>
              <h2>{User?.username}</h2>
              <p>{moment(lastMessage?.createdAt).format("hh:mm A")}</p>
            </div>
            <div className={styles.conversation_messages_info}>
              {isTyping ? (
                <p className={styles.typing}>Typing . . .</p>
              ) : lastMessage?.message ? (
                own ? (
                  <p>
                    <span>
                      {isDoubleTick ? (
                        <DoneAllIcon
                          sx={{ height: 18, width: 18 }}
                          style={{
                            color: lastMessage?.isRead ? "#03BFFD" : "gray",
                          }}
                        />
                      ) : (
                        <DoneIcon sx={{ height: 18, width: 18 }} />
                      )}
                    </span>
                    {lastMessage?.message}
                  </p>
                ) : (
                  <p>{lastMessage?.message}</p>
                )
              ) : lastMessage?.type === 2 ? (
                own ? (
                  <p className={styles.mediaLastMessage}>
                    <span>
                      {isDoubleTick ? (
                        <DoneAllIcon
                          sx={{ height: 18, width: 18 }}
                          style={{
                            color: lastMessage?.isRead ? "#03BFFD" : "gray",
                          }}
                        />
                      ) : (
                        <DoneIcon sx={{ height: 18, width: 18 }} />
                      )}
                    </span>
                    <div className={styles.mediaMessageIcon}>
                      <CollectionsIcon
                        sx={{ height: 15, width: 15 }}
                        fontSize="50px"
                      />
                    </div>
                    Media files
                  </p>
                ) : (
                  <p className={styles.mediaLastMessage}>
                    <div className={styles.mediaMessageIcon}>
                      <CollectionsIcon
                        sx={{ height: 15, width: 15 }}
                        fontSize="50px"
                      />
                    </div>
                    Media files
                  </p>
                )
              ) : null}
              {unread?.length > 0 && (
                <label className={styles.unread_messages}>
                  {unread?.length}
                </label>
              )}
            </div>
          </div>
        </motion.div>
      ) : (
        <SkeltonConversation />
      )}
    </>
  );
};

export default Conversation;
