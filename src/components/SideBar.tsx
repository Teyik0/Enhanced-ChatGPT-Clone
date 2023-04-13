'use client';

import { useEffect, useState } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import {
  ArrowCircleLeftIcon,
  PlusCircleIcon,
  UserIcon,
} from '@heroicons/react/outline';
import { useGlobalContext } from '@/context/store';
import { Chat, Loader } from '@/components';
import { getUserChats, postChat, postUser } from '@/context/fetch';
import { toast } from 'react-hot-toast';

const NewChatButton = () => {
  const [loading, setLoading] = useState(false);
  const { setCurrentChatId, userId, setUserChats, setChatMessages } =
    useGlobalContext();
  const newChat = async (e: React.MouseEvent<HTMLButtonElement>) => {
    setLoading(true);
    postChat(userId)
      .then((res) => {
        setLoading(false);
        // console.log('res', res);
        toast.success('Chat created');
        setUserChats((prev) => [...prev, res.chat]);
        setChatMessages([]);
        setCurrentChatId(res.chat.id);
      })
      .catch((err) => {
        setLoading(false);
        console.log('err', err);
      });
  };

  return (
    <button
      className='flex py-3 px-3 items-center gap-3 rounded-md hover:bg-gray-500/10 transition-colors duration-200 
        text-white cursor-pointer text-sm mb-2 flex-shrink-0 border border-white/20 w-full h-fit'
      onClick={newChat}
    >
      <PlusCircleIcon className='h-5 w-5 text-white' />
      <span className='mr-auto'>New chat</span>
      {loading && <Loader size='little' />}
    </button>
  );
};

const LogButton = () => {
  const [loading, setLoading] = useState(false);
  const { data: session, status } = useSession();
  const { setUserId } = useGlobalContext();

  const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    setLoading(true);
    if (status === 'authenticated') {
      await signOut({
        callbackUrl: process.env.NEXTAUTH_URL!,
        redirect: false,
      });
    } else {
      await signIn('google');
    }
    setLoading(false);
  };

  useEffect(() => {
    if (status === 'authenticated') {
      postUser(session)
        .then((res) => {
          // console.log('res', res);
          setUserId(res.user.id);
        })
        .catch((err) => {
          console.log('err', err);
        });
    }
  }, [session, setUserId, status]);

  return (
    <button
      className='flex py-3 px-3 items-center gap-3 rounded-md hover:bg-gray-500/10 transition-colors duration-200 
        text-white cursor-pointer text-sm mb-2 flex-shrink-0 border border-white/20 w-full h-fit'
      onClick={handleClick}
    >
      {status === 'authenticated' ? (
        <ArrowCircleLeftIcon className='h-5 w-5 text-white' />
      ) : (
        <UserIcon className='h-5 w-5 text-white' />
      )}
      <span className='mr-auto'>
        {status === 'authenticated' ? 'Logout' : 'Login to use this app'}
      </span>
      {loading && <Loader size='little' />}
    </button>
  );
};

const SideBar = () => {
  const {
    setModel,
    model,
    temperature,
    setTemperature,
    userId,
    userChats,
    setUserChats,
  } = useGlobalContext();

  const optionStyle = `bg-[#262626] text-white`;

  useEffect(() => {
    if (userId !== 0) {
      getUserChats(userId)
        .then((res) => {
          console.log('userChats : ', res);
          setUserChats(res.chats);
        })
        .catch((err) => {
          console.log('err', err);
        });
    }
  }, [setUserChats, userId]);

  return (
    <aside
      className='hidden sm:flex sm:flex-col 
      p-2 h-screen sm:w-[260px] bg-[#202022]'
    >
      <NewChatButton />
      <LogButton />

      <select
        className='flex bg-transparent py-3 px-3 items-center gap-3 rounded-md hover:bg-gray-500/10 transition-colors duration-200 
      text-white cursor-pointer text-sm mb-2 flex-shrink-0 border border-white/20 w-full h-fit focus:outline-none'
        name='Chat model'
        id='model-selector'
        onChange={(e) => setModel(e.target.value)}
        defaultValue={model}
      >
        <option className={optionStyle}>gpt-3.5-turbo</option>
        <option className={optionStyle}>text-davinci-003</option>
      </select>

      <div
        className='flex flex-col bg-transparent py-2 rounded-md hover:bg-gray-500/10 transition-colors duration-200 
      text-white cursor-pointer text-sm mb-2 flex-shrink-0 border border-white/20 w-full h-fit focus:outline-none px-4'
      >
        <h2>Temperature : {temperature}</h2>
        <input
          type='range'
          min='0'
          max='1'
          step='0.1'
          className='mt-2 cursor-pointer w-full'
          onChange={(e) => setTemperature(parseFloat(e.target.value))}
          defaultValue={temperature}
        />
      </div>

      <div className='mt-8 flex flex-col-reverse'>
        {userChats &&
          userChats.map((chat: any) => (
            <Chat key={chat.id} uniqueId={chat.id} chatName={chat.name} />
          ))}
      </div>
    </aside>
  );
};

export default SideBar;
