import { loadTextures } from '@utils/game/materials.helper';
import * as THREE from 'three';

//dice sizes
export const diceHeight = 1;
export const diceWidth = 1;
export const diceDepth = 1;

//dice drop position
export const diceDropPosition = {
  dice: {
    positionY: 10,
    positionX: 2.5,
    positionZ: 2.5,
  },
  dice1: {
    positionY: 10,
    positionX: -2.5,
    positionZ: -2.5,
  },
};

export const addDicesEntities = () => {
  const dices = [];
  for (const [key, value] of Object.entries(diceDropPosition)) {
    const { positionY, positionX, positionZ } = value;
    const diceGeometry = new THREE.BoxGeometry(
      diceWidth,
      diceHeight,
      diceDepth
    );

    const diceTextures = Array.from(Array(6).keys()).map((numb) => {
      const texture = loadTextures(`/assets/dice/dice-${numb + 1}.png`);
      return new THREE.MeshBasicMaterial({ map: texture });
    });
    const dice = new THREE.Mesh(diceGeometry, diceTextures);
    dice.position.y = positionY;
    dice.position.x = positionX;
    dice.position.z = positionZ;

    dices.push(dice);
  }
  return dices;
};
