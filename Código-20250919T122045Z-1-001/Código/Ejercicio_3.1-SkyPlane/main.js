
// 1. Crear escena
const scene = new THREE.Scene();


// 2. Crear cámara
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 1;


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

// 5. Fondo con rectángulo y textura espacio.jpg
const loader = new THREE.TextureLoader();
loader.load('assets/images/espacio.jpg', function(texture) {
  // Crear geometría: muy ancha y alta, pero muy fina en Z
  const geometry = new THREE.PlaneGeometry(12.8, 7.2); // Relación 1280x720
  const material = new THREE.MeshBasicMaterial({ map: texture });
  const fondo = new THREE.Mesh(geometry, material);
  fondo.position.set(0, 0, -3); // Coloca el fondo detrás de la cámara
  scene.add(fondo);
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