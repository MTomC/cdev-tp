// Crear la escena
const escena = new THREE.Scene();
escena.background = new THREE.Color(0x00ff00); // Verde

// Cámara del tamaño de la pantalla
const camara = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camara.position.z = 6;

// Renderizador
const renderizador = new THREE.WebGLRenderer({
  canvas: document.querySelector("#miCanvas"),
  antialias: true
});
renderizador.setSize(window.innerWidth, window.innerHeight);

// Agregar una luz Direccional
const luz = new THREE.DirectionalLight(0xffffff, 1);
luz.position.set(5, 5, 5);
escena.add(luz);

// Crear geometría y material para el cubo gris
const geometriaCubo = new THREE.BoxGeometry(1, 1, 1);
const materialCubo = new THREE.MeshStandardMaterial({ color: 0x888888 }); // Gris
const cubo = new THREE.Mesh(geometriaCubo, materialCubo);
escena.add(cubo);



// Animación 
function animar() {
  requestAnimationFrame(animar); 

  // Hacer girar el cubo
  cubo.rotation.x += 0.01;
  cubo.rotation.y += 0.01;

  // Llamado al renderizador
  renderizador.render(escena, camara);
}
animar();
