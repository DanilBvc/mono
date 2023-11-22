'use client';
import { loginUrl } from 'src/utils/network';
import React, { useState } from 'react';
import Button from '@app/component/generall/button/button';
import { buttonType } from '@app/component/generall/button/button.type';
import { defaultErrorState } from 'src/staticData/staticData';
import InputField from '@app/component/generall/inputField/inputField';
import ModalError from '@app/component/generall/modalError/modalError';
import Link from 'next/link';
import { saveToLocalStorage } from '@utils/utils';
import { useRouter } from 'next/navigation';
import { unauthorizedRequest } from '@utils/queries';

function Login() {
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

  const login = async (e) => {
    e.preventDefault();
    try {
      const response = await unauthorizedRequest(loginUrl, 'POST', formState);
      const { accessToken } = response;
      console.log(response);
      saveToLocalStorage('accessToken', accessToken);
      router.push('/home');
    } catch (err) {
      setErrorState({ error: true, errorText: String(err) });
    }
  };
  return (
    <div className='flex h-screen w-full items-center justify-center overflow-hidden bg-[#4970B5]'>
      <form
        className='m-auto flex  max-h-[90vh] w-[50%] flex-col gap-4 overflow-hidden rounded-[20px] bg-white p-[5vw] text-center'
        onSubmit={login}
      >
        Login
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
          Don’t have an account yet?
          <Link
            className='pl-1 text-xs hover:text-[#4970B5]'
            href={`/register`}
          >
            Sign up
          </Link>
        </h4>
      </form>
    </div>
  );
}

export default Login;
