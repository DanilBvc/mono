'use client';
import React, { useEffect, useState } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/navigation';
import { getFromLocalStorage } from '@utils/utils';
import { whoAmI } from 'src/utils/network';
import { authorizedRequest } from '@utils/queries';
import useUserDataStore from 'src/store/user-store';

export function ProtectedRoute<T>(WrappedComponent: NextPage<T>): NextPage<T> {
  const ProtectedComponent: NextPage<T> = (props: T) => {
    const [isAuth, setIsAuth] = useState(true);
    const setUserData = useUserDataStore((state) => state.setUserData);
    const router = useRouter();
    const accessToken = getFromLocalStorage('accessToken');
    const getUserData = async () => {
      try {
        const response = await authorizedRequest(whoAmI, 'GET');
        if (!response) {
          setIsAuth(false);
        } else {
          setUserData(response);
          setIsAuth(true);
        }
      } catch (err) {
        console.log(err);
        setIsAuth(false);
      }
    };

    useEffect(() => {
      getUserData();
      if (!isAuth) {
        router.push('/login');
      }
    }, [isAuth, router]);

    if (!isAuth) {
      return null;
    }

    return <WrappedComponent {...props} />;
  };

  return ProtectedComponent;
}
