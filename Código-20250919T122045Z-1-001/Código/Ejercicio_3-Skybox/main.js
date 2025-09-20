
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

// 5. Cargar texturas para el skybox
const loader = new THREE.TextureLoader();
const materialArray = [];

const sides = ['right', 'left', 'up', 'down', 'back', 'front'];

sides.forEach((side) => {
  const texture = loader.load(`assets/textures/cube_${side}.png`);
  materialArray.push(
    new THREE.MeshBasicMaterial({
      map: texture,
      side: THREE.BackSide, // Mostrar desde dentro del cubo
    })
  );
});


// 6. Crear la geometría del cubo
const skyboxGeo = new THREE.BoxGeometry(100, 100, 100);
const skybox = new THREE.Mesh(skyboxGeo, materialArray);
scene.add(skybox);

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