// Importar Stats.js
import Stats from './libs/stats.module.js';

// Crear el panel de estadísticas
const stats = new Stats();
stats.showPanel(0); // 0: fps
document.body.appendChild(stats.dom);

// Crear la escena
const escena = new THREE.Scene();
escena.background = new THREE.Color("#162043"); // Azul oscuro

// Cámara del tamaño de la pantalla
const camara = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camara.position.z = 190;

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

// --- Estrellas ---
const estrellas = [];

function crearEstrella() {
  // Tamaño aleatorio
  const radio = Math.random() * 1.5 + 0.5;
  const geometria = new THREE.SphereGeometry(radio, 8, 8);
  // Color aleatorio
  const color = new THREE.Color(Math.random(), Math.random(), Math.random());
  const material = new THREE.MeshStandardMaterial({ color });
  const estrella = new THREE.Mesh(geometria, material);
  // Posición aleatoria en un rango amplio
  estrella.position.x = (Math.random() - 0.5) * 200;
  estrella.position.y = (Math.random() - 0.5) * 120;
  estrella.position.z = (Math.random() - 0.5) * 100;
  // Velocidad aleatoria lenta
  estrella.userData = {
    vx: (Math.random() - 0.5) * 0.05,
    vy: (Math.random() - 0.5) * 0.05,
    vz: (Math.random() - 0.5) * 0.05
  };
  escena.add(estrella);
  estrellas.push(estrella);
}

// Crear nuevas estrellas cada x msegundos
setInterval(crearEstrella, 100);


function animar() {
  requestAnimationFrame(animar);

  // Mover estrellas
  for (const estrella of estrellas) {
    estrella.position.x += estrella.userData.vx;
    estrella.position.y += estrella.userData.vy;
    estrella.position.z += estrella.userData.vz;
  }

  // Llamado al panel de estadísticas de rendimiento
  stats.begin();
  renderizador.render(escena, camara);
  stats.end();
}
animar();
