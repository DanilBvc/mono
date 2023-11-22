'use client';
import { registerUrl } from 'src/utils/network';
import React, { useState } from 'react';
import Button from '@app/component/generall/button/button';
import { buttonType } from '@app/component/generall/button/button.type';
import InputField from '@app/component/generall/inputField/inputField';
import ModalError from '@app/component/generall/modalError/modalError';
import { defaultErrorState } from 'src/staticData/staticData';
import Link from 'next/link';
import { saveToLocalStorage } from '@utils/utils';
import { useRouter } from 'next/navigation';
import { unauthorizedRequest } from '@utils/queries';

function Register() {
  const [formState, setFormState] = useState({
    userName: '',
    password: '',
  });
  const [errorState, setErrorState] = useState(defaultErrorState);
  const { userName, password } = formState;
  const { error, errorText } = errorState;

  const router = useRouter();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormState((prevState) => ({ ...prevState, [name]: value }));
  };

  const hideErrorModal = () => {
    setErrorState(defaultErrorState);
  };

  const register = async (e) => {
    e.preventDefault();
    try {
      const response = await unauthorizedRequest(
        registerUrl,
        'POST',
        formState
      );
      const { tokens, userData } = response;
      saveToLocalStorage('accessToken', tokens.accessToken);
      router.push('/home');
    } catch (err) {
      setErrorState({ error: true, errorText: String(err) });
    }
  };

  return (
    <div className='flex h-screen w-full items-center justify-center overflow-hidden bg-[#4970B5]'>
      <form
        onSubmit={register}
        className='m-auto flex  max-h-[90vh] w-[50%] flex-col gap-4 overflow-hidden rounded-[20px] bg-white p-[5vw] text-center'
      >
        Register
        <ModalError text={errorText} open={error} close={hideErrorModal} />
        <InputField
          type={'text'}
          name={'userName'}
          placeholder={'please enter your name'}
          value={userName}
          onChange={handleChange}
        />
        <InputField
          type={'password'}
          name={'password'}
          placeholder={'please enter your password'}
          value={password}
          onChange={handleChange}
        />
        <Button text={'Submit'} type={buttonType.submit} />
        <h4 className='text-xs'>
          Have an account?
          <Link className='pl-1 text-xs hover:text-[#4970B5]' href={`/login`}>
            Sign in
          </Link>
        </h4>
      </form>
    </div>
  );
}

export default Register;
