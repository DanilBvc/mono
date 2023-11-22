import { useOnClickOutside } from '@hooks/useClickOutside';
import React, { FC, useRef, useState, useEffect } from 'react';
import { modalPropsType } from './modal.type';
import Button from '../button/button';
import { buttonType } from '../button/button.type';

const Modal: FC<modalPropsType> = ({ close, children, open }) => {
  const ref = useRef();
  const [isAnimating, setIsAnimating] = useState(false);

  const handleCloseModal = () => {
    setIsAnimating(true);
  };

  const handleTransitionEnd = () => {
    if (!open) {
      setIsAnimating(false);
      close();
    }
  };

  useEffect(() => {
    if (!open) {
      setIsAnimating(true);
    }
  }, [open]);

  useOnClickOutside(ref, handleCloseModal);

  return (
    <div
      className={`fixed inset-0 z-[2] flex items-center justify-center bg-[#00000050] transition-opacity duration-300 ${
        open ? 'opacity-1 h-full' : 'pointer-events-none h-0 w-0 opacity-0'
      }`}
    >
      <div
        ref={ref}
        className={`relative z-[3] max-h-[calc(100%-40px)] w-[calc(100%-40px)] overflow-auto rounded-lg bg-white p-[1.7rem] ${
          isAnimating ? 'animate-close-modal' : 'animate-open-modal'
        }`}
        onTransitionEnd={handleTransitionEnd}
      >
        {children}
        <Button text={'back'} type={buttonType.button} onClick={close} />
      </div>
    </div>
  );
};

export default Modal;
