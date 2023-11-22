import React, { FC } from 'react';
import { roomType } from '../main/Room/room.type';
import GameField from './gameField/gameField';

const GameComponent: FC<{ gameData: roomType }> = ({ gameData }) => {
  const { _id, roomName, players, maxPlayers, createdAt } = gameData;
  return <GameField />;
};

export default GameComponent;
