"use client";

import {
  createContext,
  useContext,
  Dispatch,
  SetStateAction,
  useState,
} from "react";

type Chat = {
  id: string;
  name: string;
  userId: string;
  createdAt: string;
};

export type Message = {
  id: string;
  text: string;
  createdAt: string;
  chatId: string;
  author: string;
};

interface ContextProps {
  currentChatId: string | undefined;
  setCurrentChatId: Dispatch<SetStateAction<string | undefined>>;
  model: string;
  setModel: Dispatch<SetStateAction<string>>;
  temperature: number;
  setTemperature: Dispatch<SetStateAction<number>>;
  userId: string;
  setUserId: Dispatch<SetStateAction<string>>;
  userChats: Chat[];
  setUserChats: Dispatch<SetStateAction<Chat[]>>;
  chatMessages: Message[];
  setChatMessages: Dispatch<SetStateAction<Message[]>>;
  openAIKey: string;
  setOpenAIKey: Dispatch<SetStateAction<string>>;
  toggleMenu: boolean;
  setToggleMenu: Dispatch<SetStateAction<boolean>>;
}

const GlobalContext = createContext<ContextProps>({
  currentChatId: "",
  setCurrentChatId: (): number | undefined => undefined,
  model: "",
  setModel: (): string => "",
  temperature: 0,
  setTemperature: (): number => 0,
  userId: "",
  setUserId: (): number => 0,
  userChats: [],
  setUserChats: (): Chat[] => [],
  chatMessages: [],
  setChatMessages: (): Message[] => [],
  openAIKey: "",
  setOpenAIKey: (): string => "",
  toggleMenu: false,
  setToggleMenu: (): boolean => false,
});

export const GlobalContextProvider = ({ children }: any) => {
  const [model, setModel] = useState<string>("text-davinci-003");
  const [temperature, setTemperature] = useState<number>(0.7);
  const [userId, setUserId] = useState<string>("");
  const [userChats, setUserChats] = useState<Chat[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | undefined>(
    undefined
  );
  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const [openAIKey, setOpenAIKey] = useState<string>("");
  const [toggleMenu, setToggleMenu] = useState<boolean>(false);

  return (
    <GlobalContext.Provider
      value={{
        model,
        setModel,
        temperature,
        setTemperature,
        userId,
        setUserId,
        userChats,
        setUserChats,
        currentChatId,
        setCurrentChatId,
        chatMessages,
        setChatMessages,
        openAIKey,
        setOpenAIKey,
        toggleMenu,
        setToggleMenu,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => useContext(GlobalContext);
