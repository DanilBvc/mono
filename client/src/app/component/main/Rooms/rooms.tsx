import React, { FC } from 'react';
import { roomsPropsType } from './room.type';
import Room from '../Room/room';

const Rooms: FC<roomsPropsType> = ({ rooms }) => {
  return (
    <section className='grid gap-2 md:grid-cols-2 lg:grid-cols-3'>
      {rooms && rooms.length > 0
        ? rooms.map((room) => <Room room={room} key={room._id} />)
        : 'Rooms list clear'}
    </section>
  );
};

export default Rooms;
