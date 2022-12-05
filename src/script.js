import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import gsap from "gsap";
import * as dat from "dat.gui";

/**
 * DOM
 */
let info = document.createElement("div");
info.setAttribute("id", "info");
info.style.color = "#20f404";
info.innerHTML = `Scroll to zoom<br>
  Hold left mouse button and move mouse to rotate<br>
  Hold right mouse button and move mouse to pan<br>
  Double-click to toggle fullscreen mode<br>
  Open controls (top-right) to hide/show info<br>
  Click H to hide/show controls<br>
  <a href="https://github.com/michaelkolesidis/random-triangles-cube" target="_blank">GitHub</a>
`;

document.body.appendChild(info);
let visible = true;

/**
 * Debug
 */
const gui = new dat.GUI({ closed: true, width: 200 });
// gui.hide();

const parameters = {
  color: 0x20f404,
  wireframe: true,
  toggleInfo: () => {
    if (visible) {
      info.style.display = "none";
      visible = false;
    } else {
      info.style.display = "block";
      visible = true;
    }
  },
  spinY: () => {
    gsap.to(mesh.rotation, { duration: 1, y: mesh.rotation.y + Math.PI * 2 });
  },
  spinX: () => {
    gsap.to(mesh.rotation, { duration: 1, x: mesh.rotation.x + Math.PI * 2 });
  },
  spinZ: () => {
    gsap.to(mesh.rotation, { duration: 1, z: mesh.rotation.z + Math.PI * 2 });
  },
};

gui.addColor(parameters, "color").onChange(() => {
  material.color.set(parameters.color);
});

gui.add(parameters, "wireframe").onChange(() => {
  material.wireframe = parameters.wireframe;
});

gui.add(parameters, "toggleInfo");
gui.add(parameters, "spinY");
gui.add(parameters, "spinX");
gui.add(parameters, "spinZ");

/**
 * Base
 */
// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

// Geometry
const geometry = new THREE.BufferGeometry();

const count = 1000;
const positionsArray = new Float32Array(count * 3 * 3);

const min = -10;
const max = 10;

for (let i = 0; i < count * 3 * 3; i++) {
  positionsArray[i] = Math.random() * (max - min) + min;
}

const positionsAttribute = new THREE.BufferAttribute(positionsArray, 3);
geometry.setAttribute("position", positionsAttribute);

const material = new THREE.MeshBasicMaterial({
  color: parameters.color,
  wireframe: parameters.wireframe,
});
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

// Sizes
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

// Camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);

camera.position.x = -15.130161720723741;
camera.position.y = 18.62843404074141;
camera.position.z = -18.52248825541633;

scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Animate
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();

// Fullscreen mode
window.addEventListener("dblclick", () => {
  const fullscreenElement =
    document.fullscreenElement || document.webkitFullscreenElement;

  if (!fullscreenElement) {
    if (canvas.requestFullscreen) {
      canvas.requestFullscreen();
    } else if (canvas.webkitRequestFullscreen) {
      canvas.webkitRequestFullscreen();
    }
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    }
  }
});
