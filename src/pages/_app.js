import { SessionProvider } from "next-auth/react";
import "../styles/globals.css";
import ChatProvider from "../context/chat";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoadingScreen from "@/components/LoadingScreen";
import VideoCallProvider from "@/context/VideoCall";

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <>
      <SessionProvider session={session}>
        <VideoCallProvider>
          <ChatProvider>
            <LoadingScreen>
              <Component {...pageProps} />
            </LoadingScreen>
          </ChatProvider>
        </VideoCallProvider>
      </SessionProvider>
      <ToastContainer limit={1} />
    </>
  );
}

export default MyApp;
