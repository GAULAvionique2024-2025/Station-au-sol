<!-- Three.js canvas used by the MyThreeView component -->

<script setup>
import { Scene, PerspectiveCamera, AxesHelper, WebGLRenderer } from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import WebGL from 'three/addons/capabilities/WebGL.js';

import { ref, onMounted, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useDataStore } from '@/stores/data';

// With/height ratio of the Three.js canvas
const viewWidthMultiplier = 0.5;

const threeDiv = ref(null);

onMounted(() => {
  createScene(threeDiv);
  createResizeEvent();
})

// Three.js variables
let threeScene;
let threeCamera;
let threeRenderer;
let threeControls;
let fusee;

function createScene(threeDiv) {
  // Div containing the Three.js canvas
  let width = threeDiv.value.offsetWidth * viewWidthMultiplier;
  let height = threeDiv.value.offsetHeight;

  // Create a Three.js scene
  threeScene = new Scene();

  // Create a Three.js camera (fov, aspect, near, far)
  threeCamera = new PerspectiveCamera(20, width / height, 1, 1000);

  // Create the axes to help visualize the orientation
  const axesHelper = new AxesHelper(5);
  threeScene.add(axesHelper);

  // Create a Three.js renderer
  threeRenderer = new WebGLRenderer({ antialias: true });
  threeRenderer.setClearColor(0xFFFFFF); // Background color
  threeRenderer.setSize(width, height)
  threeDiv.value.appendChild(threeRenderer.domElement);

  // Add the model of the rocket to the scene
  const loader = new GLTFLoader();
  loader.load(
    // resource URL
    '/models/fusee.glb',
    // called when the resource is loaded
    (gltf) => {
      fusee = gltf.scene.children[0];
      fusee.material.wireframe = true;
      threeScene.add(fusee);
    },
    // called while loading is progressing
    undefined,
    // called when loading has errors
    (err) => {
      console.error(err);
    }
  );

  // Position the camera
  threeCamera.position.set(50, 20, 50);
  threeControls = new OrbitControls(threeCamera, threeRenderer.domElement);

  // First render
  if (WebGL.isWebGLAvailable()) {
    threeAnimate();
  } else {
    console.log("WebGL unavailable");
  }
}

function threeAnimate() {
  requestAnimationFrame(threeAnimate);
  threeControls.update(); // required if controls.enableDamping or controls.autoRotate are set to true
  threeRenderer.render(threeScene, threeCamera);
}

function createResizeEvent() {
  // Ajust the size of the canvas when the window is resized
  window.addEventListener('resize', () => {
    resize();
  });
  // Ajust the size of the canvas when a button is clicked
  window.addEventListener('click', () => {
    resize();
  });
}

function resize() {
  let width = threeDiv.value.offsetWidth * viewWidthMultiplier;
  let height = threeDiv.value.offsetHeight;
  // Update the camera
  threeCamera.aspect = width / height;
  threeCamera.updateProjectionMatrix();
  // Update the renderer
  threeRenderer.setSize(width, height);
  threeRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  threeRenderer.render(threeScene, threeCamera);
}


// Update when data is updated
const { currentData } = storeToRefs(useDataStore());

watch(currentData, async (newData, _) => {
  rotateModel(newData ? newData : { pitch: 0, roll: 0, yaw: 0 });
});

function rotateModel(data) {
  if (fusee) {
    // Right axis
    fusee.rotation.x = data.pitch * Math.PI / 180;
    // Up axis
    fusee.rotation.y = data.roll * Math.PI / 180;
    // Front axis
    fusee.rotation.z = data.yaw * Math.PI / 180;
  }
}
</script>

<template>
  <div id="threejs" ref="threeDiv"></div>
</template>

<style lang="scss">
@use '@/assets/scss/variables' as *;

#threejs {
  canvas {
    border: 1px solid #ccc;
  }

  @media screen and (min-width: 0px) and (max-width: calc($layout-breakpoint-sm - 0.2px)) {
    display: flex;
    justify-content: center;
  }
}
</style>