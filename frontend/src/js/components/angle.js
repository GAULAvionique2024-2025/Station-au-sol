/**
 * Angle component (display the orientation of the rocket in 3D)
 * @module components/Angle
 */

import ComponentClass from './componentClass.js';
import {
    Scene,
    PerspectiveCamera,
    AxesHelper,
    WebGLRenderer,
} from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import WebGL from 'three/addons/capabilities/WebGL.js';

export default class Angle extends ComponentClass {
    // angleList = [{pitch:PITCH, roll:ROLL, yaw:YAW}]
    angleList = [];

    constructor({
        'pitchId': pitchId = 'pitch',
        'yawId': yawId = 'yaw',
        'rollId': rollId = 'roll',
        'viewId': viewId = 'threejs',
        'viewWidthMultiplier': viewWidthMultiplier = 0.5,
    } = {}) {
        super();
        // Link DOM elements
        this.pitchElem = document.getElementById(pitchId);
        this.yawElem = document.getElementById(yawId);
        this.rollElem = document.getElementById(rollId);
        // Attributes
        this.viewWidthMultiplier = viewWidthMultiplier;
        // Create Three.js scene
        this.createScene(viewId);
        // Resize event
        this.createResizeEvent();
    }

    createScene(divId) {
        // Div containing the Three.js canvas
        this.threeCanvasDiv = document.getElementById(divId);
        let width = this.threeCanvasDiv.offsetWidth * this.viewWidthMultiplier;
        let height = this.threeCanvasDiv.offsetHeight;

        // Create a Three.js scene
        this.threeScene = new Scene();

        // Create a Three.js camera (fov, aspect, near, far)
        this.threeCamera = new PerspectiveCamera(20, width / height, 1, 1000);

        // Create the axes to help visualize the orientation
        const axesHelper = new AxesHelper(5);
        this.threeScene.add(axesHelper);

        // Create a Three.js renderer
        this.threeRenderer = new WebGLRenderer({ antialias: true });
        this.threeRenderer.setClearColor(0xFFFFFF);
        this.threeRenderer.setSize(width, height)
        this.threeCanvasDiv.appendChild(this.threeRenderer.domElement);

        // Add the model of the rocket to the scene
        const loader = new GLTFLoader();
        loader.load(
            // resource URL
            '/models/fusee.glb',
            // called when the resource is loaded
            (gltf) => {
                this.fusee = gltf.scene.children[0];
                this.fusee.material.wireframe = true;
                this.threeScene.add(this.fusee);
            },
            // called while loading is progressing
            undefined,
            // called when loading has errors
            (err) => {
                console.error(err);
            }
        );

        // Position the camera
        this.threeCamera.position.set(50, 20, 50);
        this.threeControls = new OrbitControls(this.threeCamera, this.threeRenderer.domElement);

        // First render
        if (WebGL.isWebGLAvailable()) {
            this.threeAnimate();
        } else {
            console.log("WebGL unavailable");
        }
    }

    createResizeEvent() {
        // Ajust the size of the canvas when the window is resized
        window.addEventListener('resize', () => {
            this.resize();
        });
        // Ajust the size of the canvas when a button is clicked
        window.addEventListener('click', () => {
            this.resize();
        });
    }

    resize() {
        let width = this.threeCanvasDiv.offsetWidth * this.viewWidthMultiplier;
        let height = this.threeCanvasDiv.offsetHeight;
        // Update the camera
        this.threeCamera.aspect = width / height;
        this.threeCamera.updateProjectionMatrix();
        // Update the renderer
        this.threeRenderer.setSize(width, height);
        this.threeRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.threeRenderer.render(this.threeScene, this.threeCamera);
    }

    // Called each frame
    threeAnimate = () => {
        requestAnimationFrame(this.threeAnimate);
        // required if controls.enableDamping or controls.autoRotate are set to true
        this.threeControls.update();
        this.threeRenderer.render(this.threeScene, this.threeCamera);
    }

    rotateModel(data) {
        if (this.fusee) {
            // Right axis
            this.fusee.rotation.x = data.pitch * Math.PI / 180;
            // Up axis
            this.fusee.rotation.y = data.roll * Math.PI / 180;
            // Front axis
            this.fusee.rotation.z = data.yaw * Math.PI / 180;
        }
    }

    updateValues(data) {
        this.pitchElem.textContent = data.pitch;
        this.yawElem.textContent = data.yaw;
        this.rollElem.textContent = data.roll;
    }

    update(data) {
        this.updateValues(data);
        this.rotateModel(data);
    }

    reset() {
        this.pitchElem.textContent = "0";
        this.yawElem.textContent = "0";
        this.rollElem.textContent = "0";
    }
}