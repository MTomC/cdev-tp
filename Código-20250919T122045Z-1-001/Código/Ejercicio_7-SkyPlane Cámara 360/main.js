
// 1. Crear escena
const scene = new THREE.Scene();


// 2. Crear cámara
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 0, 0); // Cámara dentro de la esfera


// 3. Crear renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// 4. Controles orbitales
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.minDistance = 0.1;
controls.maxDistance = 10;

// 5. Fondo con esfera y textura foto.jpg
const loader = new THREE.TextureLoader();
loader.load('assets/images/foto.jpg', function(texture) {
  // Crear geometría de esfera ajustando la escala para respetar la relación 1280x720
  const radio = 3.5;
  const geometry = new THREE.SphereGeometry(radio, 64, 64);
  // Invertir la esfera para que la textura se vea desde dentro
  const material = new THREE.MeshBasicMaterial({ map: texture, side: THREE.BackSide });
  const esfera = new THREE.Mesh(geometry, material);
  // Escalar la esfera para que la proyección tenga la relación 16:9 (1280x720)
  esfera.scale.set(1, 9/16, 1); // Escala Y para relación 16:9
  esfera.position.set(0, 0, 0); // Centro de la escena
  scene.add(esfera);
});

// 7. Loop de animación
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}
animate();

// 8. Ajustar a cambio de tamaño de ventana
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});