import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import WebGL from 'three/addons/capabilities/WebGL.js';


window.createScene = (divId) => {
    // Div qui contient le canvas de Three.js
    window.threeCanvasDiv = document.getElementById(divId);
    let width = window.threeCanvasDiv.offsetWidth * 0.5;
    let height = window.threeCanvasDiv.parentElement.offsetHeight;
    if (window.innerWidth < 992) {
        height = height * 0.6
    }

    // Crée une scène Three.js
    window.threeScene = new THREE.Scene();

    // Crée une caméra Three.js (fov, aspect, near, far)
    window.threeCamera = new THREE.PerspectiveCamera(20, width / height, 1, 1000);

    // Crée des axes pour aider à visualiser la position de la fusée
    const axesHelper = new THREE.AxesHelper(5);
    window.threeScene.add(axesHelper);

    // Crée un renderer Three.js
    window.threeRenderer = new THREE.WebGLRenderer({ antialias: true });
    window.threeRenderer.setClearColor(0xFFFFFF);
    window.threeRenderer.setSize(width, height)
    window.threeCanvasDiv.appendChild(window.threeRenderer.domElement);

    // Ajoute le modèle GLTF de la fusée à la scène
    const loader = new GLTFLoader();
    loader.load(
        // resource URL
        'models/fusee.glb',
        // called when the resource is loaded
        (gltf) => {
            window.fusee = gltf.scene.children[0];
            window.fusee.material.wireframe = true;
            window.threeScene.add(window.fusee);
        },
        // called while loading is progressing
        undefined,
        // called when loading has errors
        (err) => {
            console.error(err);
        }
    );

    // Positionne la caméra
    window.threeCamera.position.set(50, 20, 50);
    window.threeControls = new OrbitControls(window.threeCamera, window.threeRenderer.domElement);

    // First render
    if (WebGL.isWebGLAvailable()) {
        window.threeAnimate();
    } else {
        console.log("WebGL unavailable");
    }
}

// Méthode pour appliquer une rotation à la fusée
window.rotateModel = (pitch, yaw, roll) => {
    if (window.fusee) {
        // X est l'axe vers la droite
        window.fusee.rotation.x = pitch * Math.PI / 180;
        // Y est l'axe vers le haut
        window.fusee.rotation.y = roll * Math.PI / 180;
        // Z est l'axe vers l'avant
        window.fusee.rotation.z = yaw * Math.PI / 180;
    }
}

// Ajuste la taille lorsqu'on redimensionne la fenêtre
window.addEventListener('resize', () => {
    let width = window.threeCanvasDiv.offsetWidth * 0.5;
    let height = window.threeCanvasDiv.parentElement.offsetHeight;
    if (window.innerWidth < 992) {
        height = height * 0.6
    }
    // Mise à jour de la caméra
    window.threeCamera.aspect = width / height;
    window.threeCamera.updateProjectionMatrix();
    // Mise à jour du renderer
    window.threeRenderer.setSize(width, height);
    window.threeRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    window.threeRenderer.render(window.threeScene, window.threeCamera);
});

// Fonction à chaque frame
window.threeAnimate = () => {
    requestAnimationFrame(window.threeAnimate);
    // required if controls.enableDamping or controls.autoRotate are set to true
    window.threeControls.update();
    window.threeRenderer.render(window.threeScene, window.threeCamera);
}