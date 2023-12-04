import React, { FC, useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { roomType } from '../main/Room/room.type';
import io from 'socket.io-client';
import { baseUrl } from '@utils/network';
import useUserDataStore from 'src/store/user-store';
import { socketEvents } from 'src/constants/socket-events.enum';
import { addControls, handleEntitiesClick } from '@utils/game/materials.helper';
import { addPlayer } from './gameEntities/player/player.entities';
import { addSunEntities } from './gameEntities/sun/sun.entities';
import { addWaterEntities } from './gameEntities/water/water.entities';
import { addSkyEntities } from './gameEntities/sky/sky.enities';
import {
  addDicesEntities,
  diceDropPosition,
} from './gameEntities/dice/dice.entities';
import { addBoardEntities } from './gameEntities/board/board.entities';
import { animateSunAndWater } from './gameEntities/sun/sun-animation';
import { animateDice } from './gameEntities/dice/dice.helper';
import {
  calcPlayerCoords,
  movePlayerSmooth,
} from './gameEntities/player/player.helpers';
import useWebSocket from '@hooks/useWebSocket/useWebSocket';

const GameComponent: FC<{ gameData: roomType }> = ({ gameData }) => {
  //entry point
  const mountRef = useRef(null);
  //init socket connection
  const { socket } = useWebSocket(baseUrl);
  //game data
  const { roomName, createdAt, players, maxPlayers, whosTurn, _id } = gameData;
  //user data
  const userData = useUserDataStore((state) => state.userData);
  //players entities
  const [playersBox, setPlayersBox] = useState([]);

  useEffect(() => {
    if (socket) {
      socket.emit(socketEvents.JOIN_GAME, { _id, userId: userData._id });
      socket.on(socketEvents.NEW_PLAYER_JOIN, (data) => {
        console.log(data);
      });
    }
  }, [socket]);

  //board sizes
  const boardHeight = 0.7;
  const boardWidth = 10;
  const boardDepth = 10;

  const init = () => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      1,
      2000
    );
    const render = new THREE.WebGLRenderer();
    render.setPixelRatio(window.devicePixelRatio);
    render.setSize(window.innerWidth, window.innerHeight);
    render.toneMapping = THREE.ACESFilmicToneMapping;
    render.toneMappingExposure = 0.5;
    mountRef.current.appendChild(render.domElement);

    const entities = [];

    camera.position.z = 15;

    const board = addBoardEntities(boardHeight, boardWidth, boardDepth);
    const dices = addDicesEntities();
    const water = addWaterEntities();
    const sun = addSunEntities();
    const sky = addSkyEntities();
    const player = addPlayer(boardHeight, boardWidth, boardDepth);
    entities.push(board, water, sun, sky, player, ...dices);

    entities.forEach((entity) => {
      if (entity instanceof THREE.Object3D) {
        scene.add(entity);
      }
    });

    setPlayersBox((prev) => [...prev, player]);

    addControls(camera, render);

    const onDiceClick = handleEntitiesClick(
      camera,
      scene,
      dices[0],
      async () => {
        if (whosTurn === userData._id) {
          const diceResult = animateDice(
            dices[0],
            diceDropPosition.dice,
            boardHeight
          );
          const dice1Result = animateDice(
            dices[1],
            diceDropPosition.dice1,
            boardHeight
          );
          const result = await Promise.allSettled([dice1Result, diceResult]);
          let step = players.find(
            (player) => player._id === userData._id
          ).steps;
          let stepsCounter = 0;
          result.forEach(async (item) => {
            if (item.status === 'fulfilled') {
              const value = item.value as number;
              //here update
              stepsCounter += value;
            }
          });
          const makeTurn = async () => {
            await movePlayerSmooth(player, step, stepsCounter);
          };
          makeTurn();

          // socket.emit(socketEvents.ADD_STEP, {
          //   userId: userData._id,
          //   roomId: _id,
          //   steps: step,
          // });
        }
      }
    );

    const animate = function () {
      requestAnimationFrame(animate);
      animateSunAndWater(sun, sky, water);
      render.render(scene, camera);
    };

    animate();

    function onWindowResize() {
      const newWidth = window.innerWidth;
      const newHeight = window.innerHeight;

      render.setSize(newWidth, newHeight);
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
    }
    return { render, onWindowResize, onDiceClick };
  };

  useEffect(() => {
    const { render, onWindowResize, onDiceClick } = init();

    window.addEventListener('click', onDiceClick);
    window.addEventListener('resize', onWindowResize, false);
    return () => {
      mountRef.current.removeChild(render.domElement);
      window.removeEventListener('click', onDiceClick);
      window.removeEventListener('resize', onWindowResize, false);
    };
  }, []);

  useEffect(() => {
    playersBox.forEach(async (player) => {
      let stepsCounter = players[0].steps;
      let currentStep = 0;
      const makeTurn = async () => {
        if (stepsCounter > 10) {
          stepsCounter -= 10;
          currentStep += 10;
          await movePlayerSmooth(player, currentStep, 10);
          makeTurn();
        } else {
          currentStep += stepsCounter;
          await movePlayerSmooth(player, currentStep, stepsCounter);
        }
      };
      makeTurn();
    });
  }, [playersBox]);

  return <div ref={mountRef} />;
};

export default GameComponent;
