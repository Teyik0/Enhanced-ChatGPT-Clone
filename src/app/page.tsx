'use client';

import { PromptInput, Message } from '@/components';
import { useGlobalContext } from '@/context/store';
import { useEffect } from 'react';

export default function Home() {
  const { chatMessages } = useGlobalContext();
  useEffect(() => {
    var myDiv = document.getElementById('chat');
    myDiv?.scrollTo({
      top: myDiv?.scrollHeight,
      behavior: 'smooth',
    });
  }, [chatMessages]);

  return (
    <main className='relative flex flex-1 flex-col min-h-[90vh] sm:h-screen bg-[#343441] pb-[60px]'>
      <div
        className='flex flex-col py-2 overflow-y-auto overflow-x-hidden'
        id='chat'
      >
        {chatMessages.length > 0 &&
          chatMessages.map((message) => (
            <Message message={message} key={message.id + message.text} />
          ))}
      </div>
      <PromptInput />
    </main>
  );
}
