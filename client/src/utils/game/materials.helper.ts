import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

//board textures
export const setRectangleMaterial = (boardTexture, sideTextures) => [
  new THREE.MeshBasicMaterial({ map: sideTextures }),
  new THREE.MeshBasicMaterial({ map: sideTextures }),
  new THREE.MeshBasicMaterial({ map: boardTexture }),
  new THREE.MeshBasicMaterial({ map: sideTextures }),
  new THREE.MeshBasicMaterial({ map: sideTextures }),
  new THREE.MeshBasicMaterial({ map: sideTextures }),
];

export const loadTextures = (textureSrc: string) => {
  const textureLoader = new THREE.TextureLoader();
  return textureLoader.load(textureSrc);
};

export const addControls = (camera, rerender) => {
  const controls = new OrbitControls(camera, rerender.domElement);
  controls.rotateSpeed = 0.3;
  controls.maxPolarAngle = Math.PI * 0.65;
  controls.target.set(0, 10, 0);
  controls.maxDistance = 200.0;
  controls.update();
  camera.position.z = 15;
  return controls;
};

export const handleEntitiesClick = (camera, scene, entity, callBack) => {
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();
  const onClick = (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObjects(scene.children);
    if (intersects[0]?.object === entity) {
      callBack();
    }
  };
  return onClick;
};
