import {
  loadTextures,
  setRectangleMaterial,
} from '@utils/game/materials.helper';
import * as THREE from 'three';
export const addBoardEntities = (boardHeight, boardWidth, boardDepth) => {
  const boardGeometry = new THREE.BoxGeometry(
    boardWidth,
    boardHeight,
    boardDepth
  );

  const boardTexture = loadTextures('/assets/field2.jpg');
  const sideTextures = loadTextures('/assets/tree.jpg');
  const board = new THREE.Mesh(
    boardGeometry,
    setRectangleMaterial(boardTexture, sideTextures)
  );
  board.position.y = boardHeight / 2;
  return board;
};
