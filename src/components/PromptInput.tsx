'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { Toaster, toast } from 'react-hot-toast';
import { useGlobalContext } from '@/context/store';
import { Loader } from '@/components';
import { postMessage } from '@/context/fetch';

const PromptInput = () => {
  const [prompt, setPrompt] = useState('');
  const { currentChatId, model, temperature, setChatMessages, openAIKey } =
    useGlobalContext();
  const [loading, setLoading] = useState(false);
  const { data: session, status } = useSession();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    //HANDLING WRONG INPUTS
    if (!prompt) return;
    if (loading) return;

    //HANDLING CORRECT INPUTS
    setLoading(true);
    setPrompt('');

    //SENDING PROMPT TO SERVER
    const notification = toast.loading('Wait for the AI to respond...');
    if (currentChatId !== undefined) {
      postMessage(
        currentChatId,
        prompt,
        session!.user!.name!,
        model,
        temperature,
        openAIKey
      )
        .then((res) => {
          console.log('res', res);
          setChatMessages((prev) => [...prev, res.userMessage, res.iaMessage]);
          toast.success('Message sent', { id: notification });
          setLoading(false);
        })
        .catch((err) => {
          console.log('err', err);
          toast.error('Something went wrong', { id: notification });
          setLoading(false);
        });
    } else {
      toast.error('Please select a chat or create a new one', {
        id: notification,
      });
      setLoading(false);
    }
  };

  return (
    <div className='absolute bottom-2 px-2 w-full flex justify-center'>
      <Toaster position='top-right' />
      {status === 'authenticated' && (
        <form
          className='flex items-center border p-2 pl-4 border-gray-900/50 text-white
      bg-gray-700 rounded-md lg:w-[47rem] w-full'
          onSubmit={handleSubmit}
        >
          <textarea
            placeholder='Type a message...'
            value={loading ? 'Wait before asking something else...' : prompt}
            onChange={(e) => {
              if (!loading) setPrompt(e.target.value);
            }}
            rows={1}
            className='m-0 w-full resize-none border-0 bg-transparent p-0 pl-2 pr-7 
        focus:ring-0 focus-visible:ring-0 dark:bg-transparent md:pl-0'
          />
          <button
            className='rounded-md p-2 text-gray-500 hover:bg-gray-100 dark:hover:text-gray-400 
        dark:hover:bg-gray-900 disabled:hover:bg-transparent'
            type='submit'
          >
            {!loading ? (
              <svg
                stroke='currentColor'
                fill='none'
                strokeWidth='2'
                viewBox='0 0 24 24'
                strokeLinecap='round'
                strokeLinejoin='round'
                className='h-4 w-4 mr-1'
                height='1em'
                width='1em'
                xmlns='http://www.w3.org/2000/svg'
              >
                <line x1='22' y1='2' x2='11' y2='13'></line>
                <polygon points='22 2 15 22 11 13 2 9 22 2'></polygon>
              </svg>
            ) : (
              <Loader size='little' />
            )}
          </button>
        </form>
      )}
    </div>
  );
};

export default PromptInput;
