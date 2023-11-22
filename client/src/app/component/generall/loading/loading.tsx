import React, { FC } from 'react';
import { loadingPropsType } from './loading.type';

const Loading: FC<loadingPropsType> = ({ loading, children }) => {
  return (
    <>
      {loading ? (
        <div
          className='absolute inset-2/4 h-12 w-12 animate-spin rounded-full
        border-8 border-dashed border-purple-500 border-t-transparent'
        ></div>
      ) : (
        children
      )}
    </>
  );
};

export default Loading;
