import { Message } from '@/context/store';
interface MessageProps {
  message: Message;
}

const Message = ({ message }: MessageProps) => {
  const { createdAt, text, author } = message;
  return (
    <div
      className={`flex flex-col justify-center md:items-center px-2 ${
        author === 'ChatBot' ? 'bg-[#454754]' : 'bg-[#343441]'
      }`}
    >
      <div className='flex w-full lg:w-[46rem] py-4'>
        <div
          className='h-12 w-12 rounded-lg bg-gray-800 flex items-center justify-center text-white
            font-semibold mr-4'
        >
          {author === 'ChatBot' ? 'Bot' : author.slice(0, 4)}
        </div>
        <div className='text-white w-5/6'>
          {text &&
            text.split('\n').map((line: string, index: number) => {
              if (line === '')
                return (
                  <div key={createdAt}>
                    <br />
                  </div>
                );
              else return <p key={line}>{line}</p>;
            })}
        </div>
      </div>
      <div className='text-white lg:w-[46rem] w-full flex justify-end italic text-xs pb-2'>
        {createdAt && createdAt.slice(0, 16)}
      </div>
    </div>
  );
};

export default Message;
