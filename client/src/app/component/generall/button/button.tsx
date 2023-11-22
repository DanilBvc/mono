import React, { FC } from 'react';
import { buttonProps } from './button.type';

const Button: FC<buttonProps> = ({ text, type, onClick, additionalStyle }) => (
  <button
    onClick={onClick}
    className={`duration-400
     flex w-full items-center  
     justify-center
     rounded-md border-2 p-2 text-[#444444] transition
       ease-in hover:bg-[#4970b5] hover:text-[#fff] ${additionalStyle}`}
    type={type}
  >
    {text}
  </button>
);

export default Button;
