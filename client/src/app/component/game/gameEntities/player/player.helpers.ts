export const calcPlayerCoords = (player, step, stepCount) => {
  const xStep = 8.5 / 10;
  const zStep = 8.5 / 10;
  let x;
  let z;
  if (step <= 10) {
    x = player.position.x - xStep * step;
    z = player.position.z;
  }
  if (step > 10 && step <= 20) {
    x = player.position.x;
    z = player.position.z - zStep * stepCount;
  }
  if (step > 20 && step <= 30) {
    x = player.position.x + xStep * stepCount;
    z = player.position.z;
  }
  if (step > 30 && step <= 40) {
    z = player.position.z + zStep * stepCount;
    x = player.position.x;
  }
  return { x, z, y: 1.1 };
};
export const movePlayerSmooth = (player, step, stepCount, duration = 1000) => {
  return new Promise((resolve) => {
    const start = player.position.clone();
    const end = calcPlayerCoords(player, step, stepCount);
    const startTime = performance.now();

    const animate = () => {
      const currentTime = performance.now();
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      player.position.lerpVectors(start, end, progress);

      if (elapsed < duration) {
        requestAnimationFrame(animate);
      } else {
        resolve(false);
      }
    };

    requestAnimationFrame(animate);
  });
};
