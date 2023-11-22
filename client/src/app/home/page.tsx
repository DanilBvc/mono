'use client';

import Button from '@app/component/generall/button/button';
import { buttonType } from '@app/component/generall/button/button.type';
import InputField from '@app/component/generall/inputField/inputField';
import Loading from '@app/component/generall/loading/loading';
import Modal from '@app/component/generall/modal/modal';
import ModalError from '@app/component/generall/modalError/modalError';
import { ProtectedRoute } from '@app/component/hoc/protectedRoute';
import Rooms from '@app/component/main/Rooms/rooms';
import { useModalState } from '@hooks/useModalState';
import { createRoomUrl, getRoomsUrl } from 'src/utils/network';
import { useEffect, useState } from 'react';
import { defaultErrorState } from 'src/staticData/staticData';
import { authorizedRequest } from '@utils/queries';
import { useRouter } from 'next/navigation';
import { saveToLocalStorage } from '@utils/utils';

const Home = () => {
  const [formState, setFormState] = useState({
    roomName: '',
    password: '',
    maxPlayers: '',
  });
  const [errorState, setErrorState] = useState(defaultErrorState);
  const [loading, setLoading] = useState(false);
  const [rooms, setRooms] = useState([]);
  const { password, roomName, maxPlayers } = formState;
  const { error, errorText } = errorState;
  const { onClose, isOpen, onOpen } = useModalState();
  const router = useRouter();
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormState((prevState) => ({ ...prevState, [name]: value }));
  };

  const resetError = () => {
    setErrorState(defaultErrorState);
  };

  const fetchRooms = async () => {
    setLoading(true);
    try {
      const rooms = await authorizedRequest(getRoomsUrl(), 'GET');
      setRooms(rooms);
    } catch (err) {
      setErrorState({
        error: true,
        errorText: String(err),
      });
    } finally {
      setLoading(false);
    }
  };

  const createGame = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await authorizedRequest(createRoomUrl, 'POST', {
        roomName,
        password,
        maxPlayers,
      });
      setRooms((prev) => [...prev, response]);
      saveToLocalStorage('roomId', response._id);
      router.push(`/game?id=${response._id}`);
    } catch (err) {
      setErrorState({
        error: true,
        errorText: String(err),
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  return (
    <main>
      <Modal close={onClose} open={isOpen}>
        <form
          className='flex flex-col items-stretch gap-4 py-4'
          onSubmit={createGame}
        >
          <InputField
            type={'text'}
            name={'roomName'}
            placeholder={'please enter room name'}
            value={roomName}
            onChange={handleChange}
          />
          <InputField
            type={'password'}
            name={'password'}
            placeholder={'please enter room password'}
            value={password}
            onChange={handleChange}
          />
          <InputField
            type={maxPlayers}
            name={'maxPlayers'}
            placeholder={'please enter players limit'}
            value={maxPlayers}
            onChange={handleChange}
          />
          <Button text='add' type={buttonType.submit} />
        </form>
      </Modal>
      <ModalError text={errorText} open={error} close={resetError} />
      <Loading loading={loading}>
        <Rooms rooms={rooms} />
      </Loading>
      <Button
        text={'Create'}
        type={buttonType.submit}
        onClick={onOpen}
        additionalStyle='fixed bottom-0'
      />
    </main>
  );
};

export default ProtectedRoute(Home);
