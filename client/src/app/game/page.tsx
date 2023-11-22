'use client';
import GameComponent from '@app/component/game/gameComponent';
import Button from '@app/component/generall/button/button';
import { buttonType } from '@app/component/generall/button/button.type';
import InputField from '@app/component/generall/inputField/inputField';
import Loading from '@app/component/generall/loading/loading';
import Modal from '@app/component/generall/modal/modal';
import ModalError from '@app/component/generall/modalError/modalError';
import { ProtectedRoute } from '@app/component/hoc/protectedRoute';
import { roomType } from '@app/component/main/Room/room.type';
import { useModalState } from '@hooks/useModalState';
import { joinRoomUrl, reconnectToRoomUrl } from '@utils/network';
import { authorizedRequest } from '@utils/queries';
import { getFromLocalStorage, saveToLocalStorage } from '@utils/utils';
import { useSearchParams } from 'next/navigation';
import React, { ChangeEvent, useEffect, useState } from 'react';
import { defaultErrorState } from 'src/staticData/staticData';

const Game = () => {
  const searchParams = useSearchParams();
  const [gameData, setGameData] = useState<roomType | null>(null);
  const [password, setPassword] = useState('');
  const [error, setError] = useState(defaultErrorState);
  const [loading, setLoading] = useState(false);
  const { isOpen, onOpen, onClose } = useModalState();
  const inputHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const updateError = (errorText: string) => {
    setError({ error: true, errorText: errorText });
  };
  const removeError = () => {
    setError(defaultErrorState);
  };

  const goBack = () => {
    window.history.back();
  };

  const joinRoom = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const id = searchParams.get('id');
      const room: roomType = await authorizedRequest(joinRoomUrl, 'POST', {
        id,
        password,
      });
      saveToLocalStorage('roomId', room._id);
      onClose();
      setGameData(room);
    } catch (err) {
      onOpen();
      updateError(String(err));
    } finally {
      setLoading(false);
    }
  };

  const reconnect = async (roomId: string) => {
    try {
      const room: roomType = await authorizedRequest(
        reconnectToRoomUrl,
        'POST',
        {
          roomId,
        }
      );
      saveToLocalStorage('roomId', room._id);
      onClose();
      setGameData(room);
    } catch (err) {
      onOpen();
      updateError(String(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const lastRoomId = getFromLocalStorage('roomId');
    if (lastRoomId) {
      reconnect(lastRoomId);
    } else {
      onOpen();
    }
  }, [searchParams]);

  return (
    <Loading loading={loading}>
      <Modal open={isOpen} close={goBack}>
        <form onSubmit={joinRoom}>
          <InputField
            type={'password'}
            name={'password'}
            placeholder={'please enter room password'}
            value={password}
            onChange={inputHandler}
          />
          <Button text={'Join'} type={buttonType.submit} />
        </form>
      </Modal>
      <ModalError
        text={error.errorText}
        open={error.error}
        close={removeError}
      />
      {gameData ? <GameComponent gameData={gameData} /> : null}
    </Loading>
  );
};

export default ProtectedRoute(Game);
