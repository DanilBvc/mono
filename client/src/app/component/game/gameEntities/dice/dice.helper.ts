import * as THREE from 'three';
import { diceHeight } from './dice.entities';

const diceVelocity = new THREE.Vector3(0, -0.1, 0);

const diceSides = {
  3: {
    x: 0,
    z: 0,
  },
  4: {
    x: 3.15,
    z: 0,
  },

  6: {
    x: 1.6,
    z: 0,
  },
  5: {
    x: 4.7,
    z: 0,
  },

  1: {
    z: 1.5,
    x: 0,
  },

  2: {
    z: 4.7,
    x: 0,
  },
};

const directions = {
  UP: 'UP',
  DOWN: 'DOWN',
};

export const animateDice = async (dice, dropPosition, boardHeight) => {
  return new Promise((resolve) => {
    const { positionY, positionX, positionZ } = dropPosition;
    let currentDropHeight = positionY;

    const animate = (direction) => {
      if (direction === directions.DOWN) {
        const diceRotation = new THREE.Vector3(
          Math.random() * Math.PI,
          Math.random() * Math.PI,
          Math.random() * Math.PI
        );
        dice.position.add(diceVelocity);
        dice.rotation.x += diceRotation.x;
        dice.position.y = dice.position.y + 0.01;
        dice.rotation.z += diceRotation.z;

        if (dice.position.y <= diceHeight / 2 + boardHeight / 2 + boardHeight) {
          if (currentDropHeight > 0.5) {
            currentDropHeight = currentDropHeight / 2;
            requestAnimationFrame(() => animate(directions.UP));
          } else {
            dice.position.y = 1;
            requestAnimationFrame(() => animate(directions.UP));
          }
        } else {
          requestAnimationFrame(() => animate(direction));
        }
      } else {
        dice.rotation.x += dice.rotation.x;
        dice.position.y = dice.position.y + 0.5;
        dice.rotation.z += dice.rotation.z;
        if (dice.position.y >= currentDropHeight) {
          if (currentDropHeight > 0.5) {
            currentDropHeight = currentDropHeight / 2;
            requestAnimationFrame(() => animate(directions.DOWN));
          } else {
            dice.position.y = 1;
            const numb = 1; //Math.floor(Math.random() * 6) + 1;
            const randomSide = diceSides[numb];
            dice.rotation.x = randomSide.x;
            dice.rotation.z = randomSide.z;
            resolve(numb);
          }
        } else {
          requestAnimationFrame(() => animate(direction));
        }
      }
    };
    animate(directions.DOWN);
  });
};
