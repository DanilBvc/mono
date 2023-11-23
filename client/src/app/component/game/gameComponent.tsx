import React, { FC, useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { Water } from 'three/examples/jsm/objects/Water.js';
import { Sky } from 'three/examples/jsm/objects/Sky.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { roomType } from '../main/Room/room.type';
import { getRoomExpireTime } from '@utils/utils';

const GameComponent: FC<{ gameData: roomType }> = ({ gameData }) => {
  const { roomName, createdAt, players, maxPlayers } = gameData;
  //board sizes
  const boardHeight = 0.7;
  const boardWidth = 10;
  const boardDepth = 10;

  //board colors
  const materials = (boardTexture, sideTextures) => [
    new THREE.MeshBasicMaterial({ map: sideTextures }),
    new THREE.MeshBasicMaterial({ map: sideTextures }),
    new THREE.MeshBasicMaterial({ map: boardTexture }),
    new THREE.MeshBasicMaterial({ map: sideTextures }),
    new THREE.MeshBasicMaterial({ map: sideTextures }),
    new THREE.MeshBasicMaterial({ map: sideTextures }),
  ];

  //player movement
  const X_STEP = boardWidth / 10;
  const Z_STEP = boardDepth / 10;

  //dice sizes
  const diceHeight = 1;
  const diceWidth = 1;
  const diceDepth = 1;
  const diceVelocity = new THREE.Vector3(0, -0.1, 0);

  //dice animation
  const animateDice = (dice) => {
    const diceRotation = new THREE.Vector3(
      Math.random() * Math.PI,
      Math.random() * Math.PI,
      Math.random() * Math.PI
    );
    dice.position.add(diceVelocity);
    dice.rotation.x += diceRotation.x;
    dice.rotation.y += diceRotation.y;
    dice.rotation.z += diceRotation.z;
    if (dice.position.y <= diceHeight / 2 + boardHeight / 2 + boardHeight) {
      dice.position.y = diceHeight / 2 + boardHeight / 2 + boardHeight;
    } else {
      requestAnimationFrame(() => animateDice(dice));
    }
  };

  const mountRef = useRef(null);

  const loadTextures = (textureSrc: string) => {
    const textureLoader = new THREE.TextureLoader();
    return textureLoader.load(textureSrc);
  };

  const handleEntitiesClick = (camera, scene, entity, callBack) => {
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

  const addControls = (camera, rerender) => {
    const controls = new OrbitControls(camera, rerender.domElement);
    controls.rotateSpeed = 0.3;

    camera.position.z = 15;
    return controls;
  };

  const addBoardEntities = () => {
    const boardGeometry = new THREE.BoxGeometry(
      boardWidth,
      boardHeight,
      boardDepth
    );

    const boardTexture = loadTextures('/assets/field2.jpg');
    const sideTextures = loadTextures('/assets/tree.jpg');
    const board = new THREE.Mesh(
      boardGeometry,
      materials(boardTexture, sideTextures)
    );
    board.position.y = boardHeight / 2;
    return board;
  };

  const addWaterEntities = () => {
    const waterGeometry = new THREE.PlaneGeometry(10000, 10000);

    const water = new Water(waterGeometry, {
      textureWidth: 512,
      textureHeight: 512,
      waterNormals: new THREE.TextureLoader().load(
        '/assets/water.jpg',
        function (texture) {
          texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        }
      ),
      sunDirection: new THREE.Vector3(),
      sunColor: 0xffffff,
      waterColor: 0x001e0f,
      distortionScale: 3.7,
      fog: false,
    });
    water.rotation.x = -Math.PI / 2;
    return water;
  };

  const addDiceEntities = () => {
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
    dice.position.y = 5;
    return dice;
  };

  const addSunEntities = () => {
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

  const addSkyEntities = () => {
    const sky = new Sky();
    sky.scale.setScalar(10000);

    return sky;
  };

  const addPlayer = () => {
    const geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
    const material = new THREE.MeshBasicMaterial({ color: 0xfffd0000 });
    const player = new THREE.Mesh(geometry, material);
    //go position
    player.position.y = boardHeight / 2 + 0.75;
    player.position.x = boardWidth / 2 - 0.75;
    player.position.z = boardDepth / 2 - 0.75;
    //visit jail
    // player.position.y = boardHeight / 2 + 0.75;
    // player.position.x = -boardWidth / 2 + 0.75;
    // player.position.z = boardDepth / 2 - 0.75;
    //casino
    // player.position.y = boardHeight / 2 + 0.75;
    // player.position.x = -boardWidth / 2 + 0.75;
    // player.position.z = -boardDepth / 2 + 0.75;
    //go to jail
    // player.position.y = boardHeight / 2 + 0.75;
    // player.position.x = boardWidth / 2 - 0.75;
    // player.position.z = -boardDepth / 2 + 0.75;

    return player;
  };

  const calcPlayerCoords = (player, step) => {
    const xStep = 8.5 / 10;
    const zStep = 8.5 / 10;
    let x;
    let z;
    if (step <= 10) {
      x = player.position.x - xStep * step;
      z = player.position.z;
    }
    if (step > 10 && step <= 20) {
      x = player.position.x - xStep * 10;
      z = player.position.z - zStep * (step - 10);
    }
    if (step > 20 && step <= 30) {
      x = player.position.x - xStep * (30 - step);
      z = player.position.z - zStep * 10;
    }
    if (step > 30 && step <= 40) {
      x = player.position.x - xStep * 0;
      z = player.position.z - zStep * (40 - step);
    }
    return { x, z, y: 1.1 };
  };

  const movePlayerSmooth = (player, targetPosition, duration = 1000) => {
    const start = player.position.clone();
    const end = targetPosition;
    const startTime = performance.now();

    const animate = () => {
      const currentTime = performance.now();
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      player.position.lerpVectors(start, end, progress);

      if (elapsed < duration) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  };

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

    const board = addBoardEntities();
    const dice = addDiceEntities();
    const water = addWaterEntities();
    const sun = addSunEntities();
    const sky = addSkyEntities();
    const player = addPlayer();

    movePlayerSmooth(player, calcPlayerCoords(player, 7));

    entities.push(board, dice, water, sun, sky, player);

    const parameters = {
      elevation: 2,
      azimuth: 180,
    };

    function animateSunAndWater() {
      const phi = THREE.MathUtils.degToRad(90 - parameters.elevation);
      const theta = THREE.MathUtils.degToRad(parameters.azimuth);

      sun.setFromSphericalCoords(1, phi, theta);

      sky.material.uniforms['sunPosition'].value.copy(sun);
      water.material.uniforms['sunDirection'].value.copy(sun).normalize();
      water.material.uniforms['time'].value += 1.0 / 60.0;
    }

    const controls = addControls(camera, render);
    controls.maxPolarAngle = Math.PI * 0.65;
    controls.target.set(0, 10, 0);
    controls.maxDistance = 200.0;
    controls.update();

    const onDiceClick = handleEntitiesClick(camera, scene, dice, () => {
      animateDice(dice);
    });

    entities.forEach((entity) => {
      if (entity instanceof THREE.Object3D) {
        scene.add(entity);
      }
    });

    const animate = function () {
      requestAnimationFrame(animate);
      animateSunAndWater();

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

  return <div ref={mountRef} />;
};

export default GameComponent;
