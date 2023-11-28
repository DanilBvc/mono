import * as THREE from 'three';
export function animateSunAndWater(sun, sky, water) {
  const parameters = {
    elevation: 2,
    azimuth: 180,
  };

  const phi = THREE.MathUtils.degToRad(90 - parameters.elevation);
  const theta = THREE.MathUtils.degToRad(parameters.azimuth);

  sun.setFromSphericalCoords(1, phi, theta);

  sky.material.uniforms['sunPosition'].value.copy(sun);
  water.material.uniforms['sunDirection'].value.copy(sun).normalize();
  water.material.uniforms['time'].value += 1.0 / 60.0;
}
