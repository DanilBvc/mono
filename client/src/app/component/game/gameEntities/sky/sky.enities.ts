import { Sky } from 'three/examples/jsm/objects/Sky.js';

export const addSkyEntities = () => {
  const sky = new Sky();
  sky.scale.setScalar(10000);

  return sky;
};
