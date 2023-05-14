import React, { useState } from "react";
import styles from "../styles/chat.module.css";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import SearchIcon from "@mui/icons-material/Search";
import Image from "next/image";
import { axiosinstance } from "../utils/axiosinstance";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { GetReciever } from "../utils/GetReciever";

export default function Friends({ users, onCloseFriends, isActive }) {
  const { data: session } = useSession();
  const router = useRouter();
  const [search, setSearch] = useState("");

  const FilterUsers = (data) => {
    return data?.filter(
      (item) =>
        item?.username.toLocaleLowerCase()?.includes(search) ||
        item?.email.toLocaleLowerCase()?.includes(search)
    );
  };

  const HandleStartConversation = async (recieverId) => {
    try {
      const res = await axiosinstance.post("/conversations", {
        senderId: session.user.email,
        recieverId,
      });
      if (res.data) {
        const reciever = GetReciever({
          data: res.data.users,
          me: session.user.email,
        });
        router.push(`/?chat=${reciever}`);
        onCloseFriends();
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div
      className={
        isActive
          ? styles["add_friends_container"] + " " + styles["activate_friend"]
          : styles["add_friends_container"]
      }
    >
      <div className={styles.inner_add_friends_container}>
        <div className={styles.header_add_friends}>
          <label className={styles.back_btn} onClick={onCloseFriends}>
            <KeyboardBackspaceIcon />
          </label>
          <div className={styles.input_bx}>
            <label>
              <SearchIcon />
            </label>
            <input
              type="text"
              placeholder="Seacrh users all around the globe"
              onChange={(e) => setSearch(e.target.value.toLocaleLowerCase())}
            />
          </div>
        </div>
        <div className={styles.display_users_grid}>
          {FilterUsers(users)?.map((item, index) => {
            return (
              <div className={styles.user_card} key={index + 1}>
                <div className={styles.user_img}>
                  <Image
                    src={
                      item?.profilepic
                        ? item?.profilepic
                        : "https://hope.be/wp-content/uploads/2015/05/no-user-image.gif"
                    }
                    alt="userImg"
                    height="50px"
                    width="50px"
                  />
                </div>
                <div className={styles.user_info}>
                  <div className={styles.user_inner_info}>
                    <h2>{item?.username}</h2>
                    <p>{item?.email}</p>
                  </div>
                  <button onClick={() => HandleStartConversation(item?.email)}>
                    +
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
