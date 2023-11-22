import React, { FC } from 'react';
import { roomPropsType } from './room.type';
import Link from 'next/link';

const Room: FC<roomPropsType> = ({ room }) => {
  const { roomName, players, maxPlayers, _id } = room;

  return (
    <div className=' w-full rounded-lg bg-white p-6 shadow-lg'>
      <div className='mb-4 flex items-center justify-between'>
        <h2 className='text-xl font-semibold text-gray-700'>{roomName}</h2>
        <span className='text-sm text-gray-500'>
          {players.length}/{maxPlayers}
        </span>
      </div>
      <div>
        {players.map((player, index) => (
          <div key={index} className='flex items-center justify-between'>
            <span className='text-gray-700'>{player.userName}</span>
          </div>
        ))}
      </div>
      <div className='mt-4 flex'>
        <Link
          href={{ pathname: '/game', query: { id: _id } }}
          className='mr-2 flex-grow rounded bg-green-500 px-4 py-2 text-center font-bold text-white hover:bg-green-600'
        >
          Join
        </Link>
      </div>
    </div>
  );
};

export default Room;
