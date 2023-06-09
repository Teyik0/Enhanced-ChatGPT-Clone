"use client";
import { useState } from "react";
import { ChatIcon, TrashIcon, PencilAltIcon } from "@heroicons/react/outline";
import { toast } from "react-hot-toast";
import { Loader } from "@/components";
import { deleteChat, getChatMessages } from "@/context/fetch";
import { useAtom } from "jotai/react";
import {
  chatMessagesAtom,
  currentChatIdAtom,
  toggleMenuAtom,
  userChatsAtom,
} from "@/context/store";

interface ChatProps {
  uniqueId: string;
  chatName: string;
}

const Chat = ({ uniqueId, chatName }: ChatProps) => {
  const [modifyChatName, setModifyChatName] = useState(false);
  const [loading, setLoading] = useState(false);
  const [newChatName, setNewChatName] = useState(chatName);

  const [currentChatId, setCurrentChatId] = useAtom(currentChatIdAtom);
  const [userChats, setUserChats] = useAtom(userChatsAtom);
  const [, setChatMessages] = useAtom(chatMessagesAtom);
  const [, setToggleMenu] = useAtom(toggleMenuAtom);

  const selectChat = () => {
    setCurrentChatId(uniqueId);
    setToggleMenu(false);
    getChatMessages(uniqueId)
      .then((messages) => {
        setChatMessages(messages.messages);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const modifyChatValue = async () => {};
  const removeChat = async () => {
    setLoading(true);
    deleteChat(uniqueId)
      .then((res) => {
        if (currentChatId === uniqueId) {
          setCurrentChatId(undefined);
          setChatMessages([]);
        }
        const updatedChats = userChats.filter((chat) => chat.id !== uniqueId);
        setUserChats(updatedChats);
        toast.success("Chat deleted");
        setLoading(false);
      })
      .catch((err) => {
        toast.error("Something went wrong");
        console.log("err", err);
        setLoading(false);
      });
  };

  return (
    <button
      className={`${
        uniqueId === currentChatId ? "bg-gray-900" : "hover:bg-gray-500/10"
      } flex py-3 px-3 items-center gap-3 rounded-md transition-colors duration-200 
    text-white cursor-pointer text-sm mb-2 flex-shrink-0 border border-white/20 w-full h-fit`}
      onClick={() => selectChat()}
    >
      <ChatIcon className="h-5 w-5 text-white" />
      {!modifyChatName ? (
        <span className="mr-auto">{chatName}</span>
      ) : (
        <input
          className="bg-transparent outline-none w-[120px] mr-auto rounded-sm px-2"
          type="text"
          value={chatName}
          onChange={(e) => setNewChatName(e.target.value)}
        />
      )}
      <PencilAltIcon
        onClick={() => {
          if (modifyChatName) {
            modifyChatValue();
          } else {
            setModifyChatName(true);
          }
        }}
        className="h-5 w-5 text-white opacity-5 hover:opacity-60 duration-300 ease-in-out"
      />
      {!loading ? (
        <TrashIcon
          onClick={() => removeChat()}
          className="h-5 w-5 text-white opacity-5 
      hover:text-red-800 hover:opacity-60 duration-300 ease-in-out"
        />
      ) : (
        <Loader size="little" />
      )}
    </button>
  );
};

export default Chat;
