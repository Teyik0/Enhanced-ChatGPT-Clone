"use client";

import { useEffect, useState } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import {
  ArrowCircleLeftIcon,
  PlusCircleIcon,
  UserIcon,
  TrashIcon,
} from "@heroicons/react/outline";
import { CgMenuGridO } from "react-icons/cg";
import Chat from "@/components/Chat";
import Loader from "@/components/Loader";
import { deleteChat, getUserChats, postChat, postUser } from "@/context/fetch";
import { toast } from "react-hot-toast";
import { useAtom } from "jotai";
import {
  chatMessagesAtom,
  currentChatIdAtom,
  modelAtom,
  openAIKeyAtom,
  temperatureAtom,
  toggleMenuAtom,
  userChatsAtom,
  userIdAtom,
} from "@/context/store";

const NewChatButton = () => {
  const [loading, setLoading] = useState(false);

  const [, setCurrentChatId] = useAtom(currentChatIdAtom);
  const [userId] = useAtom(userIdAtom);
  const [, setUserChats] = useAtom(userChatsAtom);
  const [, setChatMessages] = useAtom(chatMessagesAtom);

  const newChat = async (e: React.MouseEvent<HTMLButtonElement>) => {
    setLoading(true);
    postChat(userId)
      .then((res) => {
        setLoading(false);
        // console.log('res', res);
        toast.success("Chat created");
        setUserChats((prev) => [...prev, res.chat]);
        setChatMessages([]);
        setCurrentChatId(res.chat.id);
      })
      .catch((err) => {
        setLoading(false);
        console.log("err", err);
      });
  };

  return (
    <>
      <button
        className="hidden sm:flex py-3 px-3 items-center gap-3 rounded-md hover:bg-gray-500/10 transition-colors duration-200 
        text-white cursor-pointer text-sm mb-2 flex-shrink-0 border border-white/20 w-full h-fit"
        onClick={newChat}
      >
        <PlusCircleIcon className="h-5 w-5 text-white" />
        <span className="mr-auto">New chat</span>
        {loading && <Loader size="little" />}
      </button>
      <button
        onClick={newChat}
        className="sm:hidden flex justify-center items-center"
      >
        <PlusCircleIcon className="sm:hidden h-8 w-8 text-white" />
      </button>
    </>
  );
};

const LogButton = () => {
  const [loading, setLoading] = useState(false);

  const { data: session, status } = useSession();
  const [, setUserId] = useAtom(userIdAtom);
  const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    setLoading(true);
    if (status === "authenticated") {
      await signOut();
    } else {
      await signIn("google");
    }
    setLoading(false);
  };

  useEffect(() => {
    if (status === "authenticated") {
      postUser(session)
        .then((res) => {
          // console.log('res', res);
          setUserId(res.user.id);
        })
        .catch((err) => {
          console.log("err", err);
        });
    }
  }, [session, setUserId, status]);

  return (
    <button
      className="flex py-3 px-3 items-center gap-3 rounded-md hover:bg-gray-500/10 transition-colors duration-200 
        text-white cursor-pointer text-sm flex-shrink-0 border border-white/20 w-full h-fit"
      onClick={handleClick}
    >
      {status === "authenticated" ? (
        <ArrowCircleLeftIcon className="h-5 w-5 text-white" />
      ) : (
        <UserIcon className="h-5 w-5 text-white" />
      )}
      <span className="mr-auto">
        {status === "authenticated" ? "Logout" : "Login to use this app"}
      </span>
      {loading && <Loader size="little" />}
    </button>
  );
};

const DeleteAllChatButton = () => {
  const [loading, setLoading] = useState(false);

  const [userChats, setUserChats] = useAtom(userChatsAtom);
  const [currentChatId, setCurrentChatId] = useAtom(currentChatIdAtom);
  const [userId] = useAtom(userIdAtom);
  const [, setChatMessages] = useAtom(chatMessagesAtom);

  const deleteAllChat = () => {
    userChats.forEach((chat) => {
      setLoading(true);
      deleteChat(chat.id)
        .then((res) => {
          setLoading(false);
          setUserChats((prev) => prev.filter((c) => c.id !== chat.id));
          if (currentChatId === chat.id) {
            setCurrentChatId(undefined);
            setChatMessages([]);
          }
          // console.log('res', res);
          toast.success("Chat deleted");
        })
        .catch((err) => {
          setLoading(false);
          console.log("err", err);
        });
    });
  };
  return (
    <button
      className="flex py-3 px-3 items-center gap-3 rounded-md hover:bg-gray-500/10 transition-colors duration-200 
    text-white cursor-pointer text-sm mb-2 flex-shrink-0 border border-white/20 w-full h-fit"
      onClick={deleteAllChat}
    >
      <TrashIcon className="h-5 w-5 text-white" />
      <span className="mr-auto">Clear conversations</span>
      {loading && <Loader size="little" />}
    </button>
  );
};

const SideBar = () => {
  const [model, setModel] = useAtom(modelAtom);
  const [temperature, setTemperature] = useAtom(temperatureAtom);
  const [openAIKey, setOpenAIKey] = useAtom(openAIKeyAtom);
  const [userId] = useAtom(userIdAtom);
  const [userChats, setUserChats] = useAtom(userChatsAtom);
  const [currentChatId] = useAtom(currentChatIdAtom);
  const [toggleMenu, setToggleMenu] = useAtom(toggleMenuAtom);

  const [chatName, setChatName] = useState("No chat selected");
  const { data: session, status } = useSession();

  const optionStyle = `bg-[#262626] text-white`;

  const getChatName = () => {
    if (currentChatId === undefined) return "No chat selected";
    const chat = userChats.find((chat) => chat.id === currentChatId);
    setChatName(chat?.name!);
  };

  useEffect(() => {
    getChatName();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentChatId]);

  useEffect(() => {
    if (userId !== "") {
      getUserChats(userId)
        .then((res) => {
          console.log("userChats : ", res);
          setUserChats(res.chats);
        })
        .catch((err) => {
          console.log("err", err);
        });
    }
  }, [setUserChats, userId]);

  return (
    <>
      <aside
        className="hidden sm:flex sm:flex-col 
      p-2 h-screen sm:w-[260px] bg-[#202022]"
      >
        {status === "authenticated" && <NewChatButton />}
        <LogButton />

        <select
          className="mt-2 flex bg-transparent py-3 px-3 items-center gap-3 rounded-md hover:bg-gray-500/10 transition-colors duration-200 
        text-white cursor-pointer text-sm mb-2 flex-shrink-0 border border-white/20 w-full h-fit focus:outline-none"
          name="Chat model"
          id="model-selector"
          onChange={(e) => setModel(e.target.value)}
          defaultValue={model}
        >
          <option className={optionStyle}>gpt-3.5-turbo</option>
          <option className={optionStyle}>text-davinci-003</option>
        </select>

        <div
          className="flex flex-col bg-transparent py-2 rounded-md hover:bg-gray-500/10 transition-colors duration-200 
      text-white cursor-pointer text-sm mb-2 flex-shrink-0 border border-white/20 w-full h-fit focus:outline-none px-4"
        >
          <h2>Temperature : {temperature}</h2>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            className="mt-2 cursor-pointer w-full"
            onChange={(e) => setTemperature(parseFloat(e.target.value))}
            defaultValue={temperature}
          />
        </div>

        <DeleteAllChatButton />

        <div className="w-full flex justify-center">
          <div
            className="flex items-center border p-2 pl-4 border-gray-900/50 text-white
        bg-gray-700 rounded-md lg:w-[47rem] w-full"
          >
            <textarea
              placeholder="OPENAI API KEY GOES HERE"
              value={openAIKey}
              onChange={(e) => setOpenAIKey(e.target.value)}
              rows={1}
              className="m-0 w-full resize-none border-0 bg-transparent p-0 pl-2 pr-7 
            focus:ring-0 focus-visible:ring-0 dark:bg-transparent md:pl-0 text-xs"
            />
          </div>
        </div>

        <div className="mt-8 flex flex-col-reverse overflow-auto scrollbar-hide">
          {userChats &&
            userChats.map((chat: any) => (
              <Chat key={chat.id} uniqueId={chat.id} chatName={chat.name} />
            ))}
        </div>
      </aside>

      <nav className="sm:hidden z-50 sticky top-0 bg-[#343441]">
        <div className="flex justify-between items-center py-2 px-2">
          <CgMenuGridO
            className="h-8 w-8 text-white cursor-pointer"
            onClick={() => setToggleMenu(!toggleMenu)}
          />
          {status === "authenticated" && (
            <h1 className="font-bold text-white">{chatName}</h1>
          )}
          {status === "authenticated" ? (
            <NewChatButton />
          ) : (
            <div className="w-[260px]">
              <LogButton />
            </div>
          )}
        </div>
        <div className="h-px w-full bg-white" />
        {toggleMenu && (
          <div className="absolute w-[260px] bg-[#202022] p-2 rounded-br-xl">
            <div className="mt-2">
              <LogButton />
            </div>

            <select
              className="mt-2 flex bg-transparent py-3 px-3 items-center gap-3 rounded-md hover:bg-gray-500/10 transition-colors duration-200 
            text-white cursor-pointer text-sm mb-2 flex-shrink-0 border border-white/20 w-full h-fit focus:outline-none"
              name="Chat model"
              id="model-selector"
              onChange={(e) => setModel(e.target.value)}
              defaultValue={model}
            >
              <option className={optionStyle}>gpt-3.5-turbo</option>
              <option className={optionStyle}>text-davinci-003</option>
            </select>

            <DeleteAllChatButton />

            <div
              className="flex flex-col bg-transparent py-2 rounded-md hover:bg-gray-500/10 transition-colors duration-200 
            text-white cursor-pointer text-sm mb-2 flex-shrink-0 border border-white/20 w-full h-fit focus:outline-none px-4"
            >
              <h2>Temperature : {temperature}</h2>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                className="mt-2 cursor-pointer w-full"
                onChange={(e) => setTemperature(parseFloat(e.target.value))}
                defaultValue={temperature}
              />
            </div>

            <div className="w-full flex justify-center">
              <div
                className="flex items-center border p-2 pl-4 border-gray-900/50 text-white
              bg-gray-700 rounded-md lg:w-[47rem] w-full"
              >
                <textarea
                  placeholder="OPENAI API KEY GOES HERE"
                  value={openAIKey}
                  onChange={(e) => setOpenAIKey(e.target.value)}
                  rows={1}
                  className="m-0 w-full resize-none border-0 bg-transparent p-0 pl-2 pr-7 
                  focus:ring-0 focus-visible:ring-0 dark:bg-transparent md:pl-0 text-xs"
                />
              </div>
            </div>

            <div className="mt-6 pt-2 flex flex-col-reverse overflow-auto scrollbar-hide max-h-[30vh]">
              {userChats &&
                userChats.map((chat: any) => (
                  <Chat key={chat.id} uniqueId={chat.id} chatName={chat.name} />
                ))}
            </div>
          </div>
        )}
      </nav>
    </>
  );
};

export default SideBar;
