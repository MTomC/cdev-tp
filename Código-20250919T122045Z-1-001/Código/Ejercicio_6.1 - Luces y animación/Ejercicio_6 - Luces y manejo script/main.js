// Crear la escena
const escena = new THREE.Scene();
escena.background = new THREE.Color("#ffffff"); // Verde

import { GLTFLoader } from './libs/GLTFLoader.js';

// Cámara del tamaño de la pantalla
const camara = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camara.position.z = 1;

// Renderizador
const renderizador = new THREE.WebGLRenderer({
  canvas: document.querySelector("#miCanvas"),
  antialias: true
});
renderizador.setSize(window.innerWidth, window.innerHeight);

// Agregar una luz Direccional
const luz = new THREE.DirectionalLight("#ffffff", 1.2);
luz.position.set(0, 4, 0);
escena.add(luz);


// Cargar la textura de fondo y crear el rectángulo
const loader = new THREE.TextureLoader();
loader.load('assets/images/cielo.jpeg', function(texture) {
  const width = 4; // ancho personalizado
  const height = 2; // alto personalizado
  
  const geometry = new THREE.PlaneGeometry(width, height);
  const material = new THREE.MeshBasicMaterial({ map: texture });
  const fondo = new THREE.Mesh(geometry, material);
  fondo.position.z = 0;
  escena.add(fondo);
  // camara.position.z = Math.max(width, height);
});



// Cargar el modelo GLTF
let modeloGLTF = null;
let mixer = null;
const plane = new GLTFLoader();
plane.load(
  'assets/models/scene.gltf',
  function (gltf) {
    // Centrar el modelo en X y Z
    gltf.scene.position.x = 0;
    gltf.scene.position.z = 0.3;
    gltf.scene.position.y = -0.1;
    gltf.scene.rotation.y = -.2;
    // Achicar el modelo a la mitad
    gltf.scene.scale.set(0.1, 0.1, 0.1);
    escena.add(gltf.scene);
    modeloGLTF = gltf.scene;

    // Si hay animaciones, crear el mixer y reproducir solo la primera
    if (gltf.animations && gltf.animations.length > 0) {
      mixer = new THREE.AnimationMixer(gltf.scene);
      const action = mixer.clipAction(gltf.animations[0]);
      action.play();
    }
  },
  undefined,
  function (error) {
    console.error('Error al cargar el modelo GLTF:', error);
  }
);




// Crear un plano gris simulando terreno bajo el modelo
const terrenoGeometry = new THREE.PlaneGeometry(100, 10);
const terrenoMaterial = new THREE.MeshPhongMaterial({ color: "#0f0f0f" });
const terreno = new THREE.Mesh(terrenoGeometry, terrenoMaterial);
terreno.rotation.x = -Math.PI / 2; // Horizontal
terreno.position.y = -0.09; // Justo debajo del modelo


// Cargar la textura de pavimento y aplicarla al plano de terreno
const pavimentoLoader = new THREE.TextureLoader();
pavimentoLoader.load('assets/images/pavimiento.jpeg', function(texture) {
  terreno.material.map = texture;
  terreno.material.needsUpdate = true;
});
escena.add(terreno);

// Crear una luz PointLight amarilla justo en el modelo
const pointLight = new THREE.PointLight(0xffff00, 1, 10);
pointLight.position.set(0, 0.2, 0); // Ajusta la posición según el modelo
pointLight.color = new THREE.Color("#f8f8d7");
escena.add(pointLight);

pointLight.visible = true;


// Animación 


function animar() {
  requestAnimationFrame(animar);


  // Llamado al renderizador
  renderizador.render(escena, camara);
}
animar();
