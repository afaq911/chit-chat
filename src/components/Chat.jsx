import Image from "next/image";
import React, { useContext, useMemo, useRef, useState } from "react";
import styles from "../styles/chat.module.css";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import InsertCommentIcon from "@mui/icons-material/InsertComment";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import InsertEmoticonSharpIcon from "@mui/icons-material/InsertEmoticonSharp";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import LogoutIcon from "@mui/icons-material/Logout";
import Conversation from "./Conversation";
import SendBtn from "./SendBtn";
import Message from "./Message";
import EmojiPicker from "emoji-picker-react";
import Nodata from "./Nodata";
import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";
import Friends from "./Friends";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { axiosinstance } from "../utils/axiosinstance";
import { GetReciever } from "../utils/GetReciever";
import socket from "../utils/socket";
import { ChatContext } from "../context/chat";
import Attachments from "./Attachments";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { Box, CircularProgress } from "@mui/material";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import $ from "jquery";
import Select from "react-select";
import { languages } from "@/utils/data";

const Chat = ({ allusers }) => {
  const [loading, setLoading] = useState(false);
  const { query, replace } = useRouter();
  const { data: session } = useSession();
  const [conversations, setConversations] = useState();
  const [Messages, setMessages] = useState([]);
  const [searchFilter, setSerachFilter] = useState();
  const [EmojiPopup, setEmojiPopup] = useState(false);
  const [isFriends, setisFriends] = useState(false);
  const [message, setmessage] = useState("", 200);
  const [recieverUser, setrecieverUser] = useState();
  const [recieverChat, setRecieverChat] = useState();
  const [isTyping, setisTyping] = useState();
  const {
    ArrivalMessage,
    setArrivalMessage,
    Online,
    setCurrentCon,
    CurrentCon,
  } = useContext(ChatContext);
  const Input_ref = useRef();
  const messageRef = useRef();
  const [newAttachments, setnewAttachments] = useState([]);
  const conSearchRef = useRef();
  const [conSearch, setConSearch] = useState("");
  const [UploadedImgs, setUploadedImgs] = useState([]);
  const recieverId =
    CurrentCon &&
    GetReciever({ data: CurrentCon?.users, me: session?.user?.email });
  const isRecieverOnline = Online?.some((item) => item?.email === recieverId);
  const [isReadAble, setisReadAble] = useState();
  const [isMessagesSend, setisMessagesSend] = useState();

  // --------------------------------- Get RealTime Messages -------------------------------

  useEffect(() => {
    socket.on("GetMessage", (message) => {
      setArrivalMessage(message);
    });

    socket.on("GetChat", (chat) => {
      setRecieverChat(chat);
    });

    socket.on("GetTyping", (typing) => {
      setisTyping(typing);
    });

    socket.on("GetRecieved", (data) => {
      setisMessagesSend(data);
    });
  }, []);

  useEffect(() => {
    let isValid = conversations?.filter(
      (item) => item?._id === recieverChat?._id
    );
    if (
      isValid?.length &&
      recieverChat?._id &&
      CurrentCon?._id &&
      recieverChat?._id === CurrentCon?._id
    ) {
      setisReadAble(true);
    } else {
      setisReadAble(false);
    }
  }, [recieverChat, conversations, CurrentCon]);

  // ------------------------------------------- Online Chat --------------------------------

  useEffect(() => {
    const SendCurrentCHat = async () => {
      socket.emit("SendChat", {
        recieverId: session?.user?.email,
        chat: CurrentCon,
      });
    };
    session?.user?.email && SendCurrentCHat();
  }, [CurrentCon, session, Messages]);

  // ------------------------------------------- Get Reciever User --------------------------------

  useMemo(() => {
    const GetRecieverUser = async () => {
      try {
        const res = await axiosinstance.get(`/user/${recieverId}`);
        setrecieverUser(res.data);
      } catch (error) {
        console.log(error);
      }
    };

    recieverId && GetRecieverUser();
  }, [recieverId, CurrentCon]);

  // ------------------------------------------- Send Messages --------------------------------

  const HandleSendMessage = async () => {
    setLoading(true);
    try {
      const res = await axiosinstance.post("/messages", {
        conversationId: CurrentCon?._id,
        senderId: session?.user?.email,
        message,
        isRecieved: [session?.user?.email],
      });
      setMessages((prev) => [...prev, res.data]);
      setmessage("");
      Input_ref.current.value = "";
      setLoading(false);

      if (ArrivalMessage?.id !== 911) {
        socket.emit("SendMessage", {
          recieverId: recieverId,
          message: { id: 911, message: res.data },
        });
      }
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  // ------------------------------------------- All Messages --------------------------------

  useMemo(() => {
    const GetMessages = async () => {
      try {
        const res = await axiosinstance.get(`/messages/${CurrentCon?._id}`);
        setMessages(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    CurrentCon && GetMessages();
  }, [CurrentCon, ArrivalMessage, isMessagesSend, isReadAble]);

  // ------------------------------------------- Read Messages --------------------------------

  useMemo(() => {
    const ReadMessages = async () => {
      try {
        const res = await axiosinstance.post(
          `/messages/read/${CurrentCon?._id}`,
          {
            senderId: session?.user?.email,
          }
        );
        socket.emit("SendMessage", {
          recieverId,
          message: res.data,
        });
      } catch (error) {
        console.log(error);
      }
    };
    CurrentCon && ReadMessages();
  }, [ArrivalMessage, CurrentCon, message, Messages]);

  // ------------------------------------------- Current Conversation --------------------------------

  const GetConversation = (val) => {
    setCurrentCon(val);
  };

  // ------------------------------------------- All Conversations --------------------------------

  useEffect(() => {
    const UpdateTyping = async () => {
      socket.emit("SendTyping", {
        recieverId,
        typing: {
          conversationId: CurrentCon?._id,
          istyping: message ? true : false,
        },
      });
    };
    recieverId && UpdateTyping();
  }, [message, recieverId]);

  // ------------------------------------------- All Conversations --------------------------------

  useMemo(() => {
    const GetConversations = async () => {
      try {
        const res = await axiosinstance.get(
          `/conversations/get/?id=${session?.user?.email}`
        );
        setConversations(
          res.data.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
        );
      } catch (error) {
        console.log(error);
      }
    };
    session?.user && GetConversations();
  }, [
    session?.user,
    query.chat,
    Messages,
    ArrivalMessage,
    CurrentCon,
    isMessagesSend,
  ]);

  useEffect(() => {
    query.chat &&
      conversations &&
      setCurrentCon(
        conversations?.filter((item) => item?.users?.includes(query.chat))[0]
      );
    query.chat && CurrentCon && replace("/", undefined, { shallow: true });
  }, [query, conversations, CurrentCon, setCurrentCon, replace]);

  // ------------------------------------------------- Other Stuff --------------------------------

  const HandleEmoji = (val) => {
    const ref = Input_ref.current;
    const start = message?.substring(0, ref.selectionStart);
    const end = message?.substring(ref.selectionStart);
    const text = start + val.emoji + end;
    message ? setmessage(text) : setmessage(val.emoji);
    setEmojiPopup(!EmojiPopup);
  };

  // ------------------------------- Add attachments -------------------------------

  const HandleAttchments = (e) => {
    let files = e.target.files;
    Object.entries(files)?.map((item) => {
      setnewAttachments((prev) => [...prev, item[1]]);
    });
  };

  useMemo(() => {
    (Messages || ArrivalMessage) && messageRef?.current?.scrollIntoView();
  }, [Messages, ArrivalMessage, messageRef]);

  const onCloseFriends = () => {
    setisFriends(false);
  };

  useEffect(() => {
    const listener = (event) => {
      if (event.code === "Enter" || event.code === "NumpadEnter") {
        event.preventDefault();
        message && HandleSendMessage();
      }
    };
    document.addEventListener("keydown", listener);
    return () => {
      document.removeEventListener("keydown", listener);
    };
  }, [message]);

  const HandleConversationSearch = (e) => {
    let value = e?.target?.value;
    setConSearch(value);
    const Conversations = $(".Fd_Name");
    $.map(Conversations, (item) => {
      if (item.innerText.toLowerCase()?.includes(value.toLowerCase())) {
        $(item).fadeIn();
      } else {
        $(item).fadeOut();
      }
    });
  };

  const HandleCancelConSearch = () => {
    setConSearch("");
    conSearchRef.current.value = "";
    const Conversations = $(".Fd_Name");
    $.map(Conversations, (item) => {
      $(item).css("display", "flex");
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.inner_chat_container}>
        <div className={styles.chat_conversation_container}>
          <div className={styles.inner_chat_conversation_header}>
            <div className={styles.user_image}>
              <Image
                src={
                  session?.user?.image
                    ? session?.user?.image
                    : "https://hope.be/wp-content/uploads/2015/05/no-user-image.gif"
                }
                alt="userImg"
                height="100%"
                width="100%"
              />
            </div>
            <div className={styles.conversation_header_options}>
              <label>
                <InsertCommentIcon onClick={() => setisFriends(true)} />
              </label>
              <label onClick={() => signOut()}>
                <LogoutIcon />
              </label>
            </div>
          </div>
          <div className={styles.search_conversation_container}>
            <div className={styles.search_input}>
              <label>
                {conSearch ? (
                  <div onClick={HandleCancelConSearch}>
                    <KeyboardBackspaceIcon />
                  </div>
                ) : (
                  <SearchIcon />
                )}
              </label>
              <input
                ref={conSearchRef}
                type="text"
                value={conSearch}
                placeholder="Search or start new chat"
                onChange={HandleConversationSearch}
              />
            </div>
            <label
              className={
                searchFilter
                  ? styles.search_filter + " " + styles.active
                  : styles.search_filter
              }
              onClick={() => setSerachFilter(!searchFilter)}
            >
              <FilterListIcon />
            </label>
          </div>
          <div className={styles.chat_main_conversations_container}>
            <div className={styles.chat_inner_conversations}>
              {conversations?.map((item) => {
                return (
                  <Conversation
                    item={item}
                    GetConversation={GetConversation}
                    key={item?._id}
                    isActive={CurrentCon?._id === item?._id}
                    isTyping={
                      item?._id === isTyping?.conversationId &&
                      isTyping?.istyping
                    }
                  />
                );
              })}
            </div>
            <div className={styles.add_new_conversations_here}>
              <button onClick={() => setisFriends(true)}>Add Friends</button>
              <p>Add new friends to start a chat with them</p>
            </div>
          </div>
        </div>
        <div
          className={`${styles.chat_container_messages} ${
            CurrentCon && styles.showChatBox
          }`}
        >
          {CurrentCon ? (
            <div className={styles.chat_inner_messages}>
              <div className={styles.chat_header_messages}>
                <div className={styles.header_msgs_user_profile}>
                  <label
                    className={styles.conversationBackIcon}
                    onClick={() => setCurrentCon()}
                  >
                    <ArrowBackIosIcon />
                  </label>
                  <div className={styles.message_header_profile_img}>
                    <Image
                      src={
                        recieverUser?.profilepic
                          ? recieverUser.profilepic
                          : "https://hope.be/wp-content/uploads/2015/05/no-user-image.gif"
                      }
                      alt="userImg"
                      height="100%"
                      width="100%"
                    />
                  </div>
                  <div className={styles.message_header_profile_info}>
                    <h2>{recieverUser?.username}</h2>
                    {isTyping?.conversationId === CurrentCon?._id &&
                    isTyping?.istyping ? (
                      <p className={styles.typing}>Typing . . .</p>
                    ) : isRecieverOnline ? (
                      <p>Online</p>
                    ) : null}
                  </div>
                </div>
                <div className={styles.message_header_cta}>
                  <div className={styles.languagesInput}>
                    <Select
                      placeholder="Display Language"
                      options={languages}
                    />
                  </div>

                  <label>
                    <SearchIcon />
                  </label>
                  <label>
                    <MoreVertIcon />
                  </label>
                </div>
              </div>
              <div className={styles.main_message_tab_display}>
                <div className={styles.inner_messages_tab_display}>
                  {Messages?.map((item, index) => {
                    return (
                      <div key={index + 1}>
                        <Message
                          type={item?.type}
                          item={item}
                          own={item?.senderId === session.user?.email}
                          recieverId={recieverId}
                          setArrivalMessage={setArrivalMessage}
                        />
                      </div>
                    );
                  })}
                  <div ref={messageRef} className={styles.spacer}></div>
                </div>

                <div className={styles.message_send_bx}>
                  <div className={styles.chat_message_send_cta}>
                    {EmojiPopup && (
                      <div className={styles.emoji_picker}>
                        <EmojiPicker
                          onEmojiClick={HandleEmoji}
                          emojiStyle="facebook"
                        />
                      </div>
                    )}
                    <label
                      className={
                        EmojiPopup
                          ? styles.message_cta_bts +
                            " " +
                            styles.active_message_cta
                          : styles.message_cta_bts
                      }
                      onClick={() => setEmojiPopup(!EmojiPopup)}
                    >
                      <InsertEmoticonSharpIcon />
                    </label>
                    <label
                      className={
                        styles.message_cta_bts + " " + styles.attachment
                      }
                      htmlFor="attachmentFile"
                    >
                      <input
                        type="file"
                        multiple
                        id="attachmentFile"
                        onChange={(e) => HandleAttchments(e)}
                      />
                      <AttachFileIcon />
                    </label>
                  </div>
                  <div className={styles.send_message_bx_inner}>
                    <input
                      ref={Input_ref}
                      type="text"
                      placeholder="Type a message"
                      value={message}
                      onChange={(e) => setmessage(e.target.value)}
                    />
                    <label
                      onClick={HandleSendMessage}
                      className={!message ? styles.sendBtnCover : null}
                    >
                      {loading ? (
                        <Box sx={{ display: "flex", color: "gray" }}>
                          <CircularProgress size={25} color="inherit" />
                        </Box>
                      ) : (
                        <SendBtn />
                      )}
                    </label>
                  </div>
                </div>
                {newAttachments?.length || UploadedImgs?.length ? (
                  <Attachments
                    data={newAttachments}
                    setnewAttachments={setnewAttachments}
                    UploadedImgs={UploadedImgs}
                    setUploadedImgs={setUploadedImgs}
                    CurrentCon={CurrentCon}
                    isRecieverOnline={isRecieverOnline}
                    isReadAble={isReadAble}
                    setMessages={setMessages}
                    recieverId={recieverId}
                  />
                ) : null}
              </div>
            </div>
          ) : (
            <Nodata />
          )}
        </div>
      </div>
      <Friends
        users={allusers}
        isActive={isFriends ? true : false}
        onCloseFriends={onCloseFriends}
      />
    </div>
  );
};

export default Chat;
