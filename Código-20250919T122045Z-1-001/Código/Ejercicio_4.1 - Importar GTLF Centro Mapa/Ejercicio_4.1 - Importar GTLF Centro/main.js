// Crear la escena
const escena = new THREE.Scene();
escena.background = new THREE.Color("#3d4b50"); // Azul

// Importar GLTFLoader
import { GLTFLoader } from './libs/GLTFLoader.js';

// Importar joystick (como global, ya que no es módulo)
import './libs/simple-joystick.js';
// Crear el joystick
const joystick = new window.SimpleJoystick();

// Cámara en perspectiva
const aspect = window.innerWidth / window.innerHeight;
const fov = 60; // ángulo de visión
const near = 0.1;
const far = 1000;
const camara = new THREE.PerspectiveCamera(fov, aspect, near, far);
camara.position.set(0, 0, 5);

// Renderizador
const renderizador = new THREE.WebGLRenderer({
  canvas: document.querySelector("#miCanvas"),
  antialias: true
});
renderizador.setSize(window.innerWidth, window.innerHeight);

// Agregar una luz Direccional
const luz = new THREE.DirectionalLight(0xffffff, 2);
luz.position.set(5, 5, 5);
escena.add(luz);




// Cargar el modelo GLTF
let modeloGLTF = null;
let mixer = null;
const plane = new GLTFLoader();
plane.load(
  'assets/models/Centro2.gltf',
  function (gltf) {

  // Centrar el modelo en X y Z
  gltf.scene.position.x = 0;
  gltf.scene.position.z = 0;
  // Escalar el modelo a 0.5 en todos los ejes
  gltf.scene.scale.set(0.03, 0.03, 0.03);
  gltf.scene.rotation.x = 0.5;
  escena.add(gltf.scene);
  modeloGLTF = gltf.scene;
  },
  undefined,
  function (error) {
    console.error('Error al cargar el modelo GLTF:', error);
  }
);


// Animación 
let clock = new THREE.Clock();
function animar() {
  requestAnimationFrame(animar);

  // Si el modelo está cargado, moverlo con el joystick
  if (modeloGLTF && joystick) {
    const axis = joystick.getAxis();
    // Mueve el modelo en X e Y (ajusta la velocidad si es necesario)
    camara.position.x += axis.x * 0.05;
    camara.position.z += axis.y * 0.05;
  }
  // Llamado al renderizador
  renderizador.render(escena, camara);
}
animar();
