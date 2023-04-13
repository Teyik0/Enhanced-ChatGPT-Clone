'use client';

import {
  createContext,
  useContext,
  Dispatch,
  SetStateAction,
  useState,
} from 'react';

type Chat = {
  id: number;
  name: string;
  userId: number;
  createdAt: string;
};

export type Message = {
  id: number;
  text: string;
  createdAt: string;
  chatId: number;
  author: string;
};
interface ContextProps {
  currentChatId: number | undefined;
  setCurrentChatId: Dispatch<SetStateAction<number | undefined>>;
  model: string;
  setModel: Dispatch<SetStateAction<string>>;
  temperature: number;
  setTemperature: Dispatch<SetStateAction<number>>;
  userId: number;
  setUserId: Dispatch<SetStateAction<number>>;
  userChats: Chat[];
  setUserChats: Dispatch<SetStateAction<Chat[]>>;
  chatMessages: Message[];
  setChatMessages: Dispatch<SetStateAction<Message[]>>;
}

const GlobalContext = createContext<ContextProps>({
  currentChatId: 0,
  setCurrentChatId: (): number | undefined => undefined,
  model: '',
  setModel: (): string => '',
  temperature: 0,
  setTemperature: (): number => 0,
  userId: 0,
  setUserId: (): number => 0,
  userChats: [],
  setUserChats: (): Chat[] => [],
  chatMessages: [],
  setChatMessages: (): Message[] => [],
});

export const GlobalContextProvider = ({ children }: any) => {
  const [model, setModel] = useState<string>('text-davinci-003');
  const [temperature, setTemperature] = useState<number>(0.7);
  const [userId, setUserId] = useState<number>(0);
  const [userChats, setUserChats] = useState<Chat[]>([]);
  const [currentChatId, setCurrentChatId] = useState<number | undefined>(
    undefined
  );
  const [chatMessages, setChatMessages] = useState<Message[]>([]);

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
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => useContext(GlobalContext);
