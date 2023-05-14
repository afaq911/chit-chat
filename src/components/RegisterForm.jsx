import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useState } from "react";
import { toast } from "react-toastify";
import styles from "../styles/register.module.css";
import { axiosinstance } from "../utils/axiosinstance";
import { UploadMedia } from "../utils/UploadMedia";
import { Box, CircularProgress } from "@mui/material";

export default function RegisterForm() {
  const [Profile, setProfile] = useState();
  const [values, setValues] = useState();
  const [progress, setProgress] = useState();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const HandleRegister = async () => {
    if (Validate()) {
      setLoading(true);
      try {
        const res = await axiosinstance.post("/auth/register", values);
        toast.success(res.data);
        router.push("/login");
        setLoading(false);
      } catch (error) {
        console.log(error);
        toast.error(error?.response.data);
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    const GetProgress = (item) => {
      setProgress((prev) => ({ ...prev, ...item }));
    };

    const OnSuccess = (item) => {
      setValues((prev) => ({ ...prev, ...item }));
      setProfile();
      setProgress();
    };

    if (Profile && !progress) {
      Profile["id"] = "profilepic";
      UploadMedia({ File: Profile, OnSuccess, GetProgress });
    }
  }, [Profile]);

  const Validate = () => {
    if (!values?.username) {
      toast.error("Please enter username");
      return false;
    } else if (!values?.email) {
      toast.error("Please enter email or mobileno");
      return false;
    } else if (!values?.password) {
      toast.error("Please enter password");
      return false;
    } else if (values?.password !== values?.cpassword) {
      toast.error("Password & Confirm Password must be same");
      return false;
    } else {
      return true;
    }
  };

  useEffect(() => {
    const listener = (event) => {
      if (event.code === "Enter" || event.code === "NumpadEnter") {
        event.preventDefault();
        HandleRegister();
      }
    };
    document.addEventListener("keydown", listener);
    return () => {
      document.removeEventListener("keydown", listener);
    };
  }, [values]);

  return (
    <div className={styles.main_register_container}>
      <div className={styles.inner_styles_container}>
        <h2>Register with chit-chat</h2>
        <div className={styles.form_profile_pic}>
          <Image
            src={
              Profile
                ? URL.createObjectURL(Profile)
                : values?.profilepic
                ? values?.profilepic
                : "https://hope.be/wp-content/uploads/2015/05/no-user-image.gif"
            }
            height="70px"
            width="70px"
            className={styles.display_img}
          />
          <div className={styles.label_upload_progress}>
            <input
              type="file"
              id="profilepic"
              onChange={(e) => setProfile(e.target.files[0])}
            />
            <label
              htmlFor="profilepic"
              className={progress?.profilepic ? styles.disabled : ""}
            >
              {progress?.profilepic ? progress?.profilepic + "%" : "Upload"}
            </label>
          </div>
        </div>
        <div className={styles.inputs}>
          <input
            type="text"
            placeholder="Username"
            onChange={({ target }) =>
              setValues({ ...values, username: target.value })
            }
          />
          <input
            type="email"
            placeholder="Email Address / Mobile no"
            onChange={({ target }) =>
              setValues({ ...values, email: target.value })
            }
          />
          <input
            type="password"
            placeholder="Password"
            onChange={({ target }) =>
              setValues({ ...values, password: target.value })
            }
          />
          <input
            type="password"
            placeholder="Confirm Password"
            onChange={({ target }) =>
              setValues({ ...values, cpassword: target.value })
            }
          />
        </div>
        <button
          className={styles.register_btn}
          disabled={progress || loading}
          onClick={HandleRegister}
        >
          {progress || loading ? (
            <Box
              sx={{
                display: "flex",
                color: "white",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <CircularProgress size={25} color="inherit" />
            </Box>
          ) : (
            "Register"
          )}
        </button>

        <p className={styles.notauser}>
          Already a user ? <Link href="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}
