import * as THREE from 'three';
import WebGL from 'three/addons/capabilities/WebGL.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';


// Create a Three.js scene
const scene = new THREE.Scene();

// Create a Three.js camera
const camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 50;

// Create axes
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

// Create grid helper
// const gridHelper = new THREE.GridHelper(1000, 100);
// scene.add(gridHelper);

// Create a Three.js renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setClearColor(0xFFFFFF);
// renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById("ori-view").appendChild(renderer.domElement);

// Control camera with mouse
const controls = new OrbitControls(camera, renderer.domElement);
//controls.update() must be called after any manual changes to the camera's transform
camera.position.set(0, 20, 40);
controls.update();


// Load the GLTF file
let fusee;
const loader = new GLTFLoader();
loader.load(
    // resource URL
    'models/fusee.glb',
    // called when the resource is loaded
    function (gltf) {
        let group = gltf.scene;
        fusee = group.children[0];
        fusee.material.wireframe = true;
        scene.add(fusee);
    },
    // called while loading is progressing
    undefined,
    // called when loading has errors
    function (error) {
        console.error(error);
    }
);


// Render the scene
function animate() {
    // Animate rocket
    if (fusee) {
        fusee.position.y = 0;
        fusee.rotation.y += 0.01;
    }
    controls.update();
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}

if (WebGL.isWebGLAvailable()) {
    // Initiate function or other initializations here
    animate();
} else {
    const warning = WebGL.getWebGLErrorMessage();
    document.getElementById('container').appendChild(warning);
}


function onResize() {
    console.log('You resized the browser window!');
}

window.addEventListener('resize', onResize);