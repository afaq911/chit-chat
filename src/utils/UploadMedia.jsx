import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "./firebase";

export const UploadMedia = async ({ File, GetProgress, OnSuccess }) => {
  const storageRef = ref(storage, File.name);
  const uploadTask = uploadBytesResumable(storageRef, File);
  uploadTask.on(
    "state_changed",
    (snapshot) => {
      const progress = Math.floor(
        (snapshot.bytesTransferred / snapshot.totalBytes) * 100
      );
      GetProgress(File.id ? { [File.id]: progress } : progress);
    },
    (error) => {},
    () => {
      getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
        OnSuccess(File.id ? { [File.id]: downloadURL } : downloadURL);
      });
    }
  );
};
