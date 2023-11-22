import React, { FC, useState } from 'react';
import { inputFieldType } from './inputField.type';

const InputField: FC<inputFieldType> = ({
  type,
  name,
  placeholder,
  value,
  onChange,
}) => {
  return (
    <input
      onChange={onChange}
      name={name}
      className='className="w-full outline-none" rounded-md bg-white px-4 py-2 shadow-md'
      type={type}
      value={value}
      placeholder={placeholder}
    />
  );
};

export default InputField;
