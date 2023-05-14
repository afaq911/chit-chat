import React, { useState } from "react";
import styles from "../styles/loader.module.css";
import Image from "next/image";
import { useSession } from "next-auth/react";

const LoadingScreen = ({ children }) => {
  const { status } = useSession();

  return <>{status === "loading" ? <Loader /> : children}</>;
};

const Loader = () => {
  return (
    <div className={styles.loader}>
      <div className={styles.loaderImg}>
        <Image
          alt="Logo"
          src={require("../../images/logo.png")}
          layout="fill"
        />
      </div>
    </div>
  );
};

export default LoadingScreen;
