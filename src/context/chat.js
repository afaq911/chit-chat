import { createContext, useContext, useState } from "react";

export const ChatContext = createContext();

const ChatProvider = ({ children }) => {
  const [Online, setOnline] = useState();
  const [ArrivalMessage, setArrivalMessage] = useState(null);
  const [CurrentCon, setCurrentCon] = useState();

  return (
    <ChatContext.Provider
      value={{
        Online,
        setOnline,
        setArrivalMessage,
        ArrivalMessage,
        setCurrentCon,
        CurrentCon,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export default ChatProvider;
