// Crear la escena
const escena = new THREE.Scene();
escena.background = new THREE.Color("#48bfeb"); // Azul

// Importar GLTFLoader
import { GLTFLoader } from './libs/GLTFLoader.js';

// Cámara ortográfica
const aspect = window.innerWidth / window.innerHeight;
const frustumSize = 7;
const camara = new THREE.OrthographicCamera(
  frustumSize * aspect / -2, // left
  frustumSize * aspect / 2,  // right
  frustumSize / 2,           // top
  frustumSize / -2,          // bottom
  0.1,                      // near
  1000                      // far
);
camara.position.z = 5;

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




// Importar la clase Personaje
import { Personaje } from './Personaje.js';
// Crear el personaje
const personaje = new Personaje(
  escena,
  'assets/models/personaje.glb',
  { x: -7, z: 0 },
  1.5
);



// Animación 
function animar() {
  requestAnimationFrame(animar);
  // Mover el personaje en x
  personaje.moverX(0.03);
  // Actualizar animación del personaje
  personaje.actualizarAnimacion();
  // Llamado al renderizador
  renderizador.render(escena, camara);
}
animar();


// Controlar animaciones del personaje con las flechas del teclado
window.addEventListener('keydown', function(event) {
  switch(event.key) {
    case 'ArrowUp':
      personaje.cambiarAnimacionPorIndice(1);
      break;
    case 'ArrowDown':
      personaje.cambiarAnimacionPorIndice(4);
      break;
    case 'ArrowLeft':
      personaje.cambiarAnimacionPorIndice(2);
      break;
    case 'ArrowRight':
      personaje.cambiarAnimacionPorIndice(3);
      break;
    default:
      return;
  }
});
