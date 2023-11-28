import * as THREE from 'three';
export const addPlayer = (
  boardHeight: number,
  boardWidth: number,
  boardDepth: number
) => {
  const geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
  const material = new THREE.MeshBasicMaterial({ color: 0xfffd0000 });
  const player = new THREE.Mesh(geometry, material);
  player.position.y = boardHeight / 2 + 0.75;
  player.position.x = boardWidth / 2 - 0.75;
  player.position.z = boardDepth / 2 - 0.75;
  return player;
};
