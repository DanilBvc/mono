import * as THREE from 'three';
export const addSunEntities = () => {
  const parameters = {
    elevation: 2,
    azimuth: 180,
  };
  const phi = THREE.MathUtils.degToRad(90 - parameters.elevation);
  const theta = THREE.MathUtils.degToRad(parameters.azimuth);
  const sun = new THREE.Vector3();
  sun.setFromSphericalCoords(1, phi, theta);
  return sun;
};
