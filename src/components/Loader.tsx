interface LoaderProps {
  size: 'little' | 'big';
}

const Loader = ({ size }: LoaderProps) => {
  return (
    <div className='flex justify-center items-center'>
      <div
        className={`animate-spin rounded-full ${
          size === 'little' ? 'h-4 w-4' : 'h-16 w-16'
        } border-b-2 border-red-700`}
      />
    </div>
  );
};

export default Loader;
