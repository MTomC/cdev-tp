// Crear la escena
const escena = new THREE.Scene();


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
const luz = new THREE.DirectionalLight("#ebd0b7ff", 2);
luz.position.set(0, 0, 5);
escena.add(luz);


// 5. Fondo con rectángulo y textura paisaje.jpg
const loader = new THREE.TextureLoader();
loader.load('assets/images/paisaje.jpg', function(texture) {
  // Crear geometría: muy ancha y alta, pero muy fina en Z
  const geometry = new THREE.PlaneGeometry(12.8, 7.2); // Relación 1280x720
  const material = new THREE.MeshStandardMaterial({ map: texture });
  // Controlar la cantidad de luz que recibe el plano:
  material.metalness = 0.5; // 0: no metálico, 1: metálico
  material.roughness = 1; // 0: pulido (más luz especular), 1: mate (menos luz)
  // Puedes ajustar estos valores según el efecto deseado
  const fondo = new THREE.Mesh(geometry, material);
  fondo.receiveShadow = true;
  fondo.position.set(0, 0, -2); // Coloca el fondo detrás de la cámara
  escena.add(fondo);
});



// Cargar el modelo GLTF
let modeloGLTF = null;
let mixer = null;
const plane = new GLTFLoader();
plane.load(
  'assets/models/scene.gltf',
  function (gltf) {
    // Centrar el modelo en X y Z
    gltf.scene.position.x = 5;
    gltf.scene.position.z = 0;
    gltf.scene.position.y = 2.5;
    gltf.scene.rotation.y = -1.5;
    escena.add(gltf.scene);
    modeloGLTF = gltf.scene;

    // Si hay animaciones, crear el mixer y reproducir la primera
    if (gltf.animations && gltf.animations.length > 0) {
      mixer = new THREE.AnimationMixer(gltf.scene);
      gltf.animations.forEach((clip) => {
        mixer.clipAction(clip).play();
      });
    }
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

  // Mover el modelo en x si está cargado
  if (modeloGLTF) {
    modeloGLTF.position.x -= 0.01;
  
     modeloGLTF.rotation.y += 0.001;
   
  }

  // Actualizar animación si existe mixer
  if (mixer) {
    let delta = clock.getDelta();
    mixer.update(delta);
  }

  // Llamado al renderizador
  renderizador.render(escena, camara);
}
animar();
