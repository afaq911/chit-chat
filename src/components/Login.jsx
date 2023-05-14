import React, { useEffect, useState } from "react";
import styles from "../styles/chat.module.css";
import "react-phone-input-2/lib/style.css";
import Link from "next/link";
import { toast } from "react-toastify";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { Box, CircularProgress } from "@mui/material";

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [values, setValues] = useState();
  const { data: session, status } = useSession();
  const Router = useRouter();

  useEffect(() => {
    if (session?.user && status !== "loading") {
      Router.push("/");
    }
  }, [session, Router]);

  const HandleLogin = async () => {
    setLoading(true);
    if (values?.email && values?.password) {
      try {
        const res = await signIn("credentials", {
          redirect: false,
          email: values?.email,
          password: values?.password,
        });

        if (res.error) {
          toast.error(res.error);
          setLoading(false);
          return;
        }

        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    } else {
      toast.error("Please enter email and password");
      setLoading(false);
    }
  };

  useEffect(() => {
    const listener = (event) => {
      if (event.code === "Enter" || event.code === "NumpadEnter") {
        event.preventDefault();
        HandleLogin();
      }
    };
    document.addEventListener("keydown", listener);
    return () => {
      document.removeEventListener("keydown", listener);
    };
  }, [values]);

  return (
    <div className={styles.login_container}>
      <div className={styles.inner_login_container}>
        <h2>Sign In with Chit-Chat</h2>
        <div className={styles.login_container_main}>
          <div className={styles.input_container_login}>
            <div className={styles.login_mobile_input}>
              <input
                type="email"
                placeholder="Your Email / Mobile No"
                onChange={({ target }) =>
                  setValues({ ...values, email: target.value })
                }
              />
              <input
                type="password"
                placeholder="Your Password"
                onChange={({ target }) =>
                  setValues({ ...values, password: target.value })
                }
              />
            </div>
          </div>
        </div>
        <div className={styles.login_button}>
          <button disabled={loading} onClick={HandleLogin}>
            {loading ? (
              <Box
                sx={{
                  display: "flex",
                  color: "white",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <CircularProgress size={30} color="inherit" />
              </Box>
            ) : (
              "Login"
            )}
          </button>
        </div>

        <p className={styles.notauser}>
          Not a user ? <Link href={"/register"}>Register</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
