import React, { FC, useState } from 'react';
import Modal from '../modal/modal';
import { modalErrorPropsType } from './modalError.type';
import Button from '../button/button';
import { buttonType } from '../button/button.type';

const ModalError: FC<modalErrorPropsType> = ({ text, open, close }) => {
  return (
    <Modal open={open} close={close}>
      <div className='flex flex-col items-center gap-3'>
        <img
          src='https://100dayscss.com/codepen/alert.png'
          width='44'
          height='38'
        />
        <span>Oh snap!</span>
        <p>{text}</p>
        <Button onClick={close} text={'Dismiss'} type={buttonType.button} />
      </div>
    </Modal>
  );
};

export default ModalError;
