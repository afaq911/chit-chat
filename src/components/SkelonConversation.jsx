import React from "react";
import styles from "../styles/skelton.module.css";

function SkelonConversation() {
  return (
    <div className={styles.skeltonconversation}>
      <div className={styles.skeltonImageBx}></div>
      <div className={styles.skeltonInfoBx}>
        <div className={styles.skeltonTextLoading}></div>
        <div className={styles.skeltonTextLoading}></div>
      </div>
    </div>
  );
}

export default SkelonConversation;
