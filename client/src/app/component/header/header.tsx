'use client';

import React from 'react';
import Button from '../generall/button/button';
import { buttonType } from '../generall/button/button.type';

function Header() {
  return (
    <header className='border-2'>
      <ul className='flex items-center justify-around'>
        <li>
          <Button text='options' type={buttonType.submit} onClick={() => {}} />
        </li>
        <li>
          <Button text='options' type={buttonType.submit} onClick={() => {}} />
        </li>
        <li>
          <Button text='options' type={buttonType.submit} onClick={() => {}} />
        </li>
      </ul>
    </header>
  );
}

export default Header;
