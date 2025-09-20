// Crear la escena
const escena = new THREE.Scene();


//escena.background = new THREE.Color("#26397D"); 

// Background tornasolado
const canvas = document.createElement("canvas");
canvas.width = 512;
canvas.height = 512;
const ctx = canvas.getContext("2d");

// Gradiente lineal
const gradient = ctx.createLinearGradient(0, 0, 512, 512);
gradient.addColorStop(0, "#26397D"); // magenta
gradient.addColorStop(1, "#2C469D"); // cian

ctx.fillStyle = gradient;
ctx.fillRect(0, 0, 512, 512);

const textura = new THREE.CanvasTexture(canvas);
escena.background = textura;
//--------------------------------------------------------------------------------------

// Cámara del tamaño de la pantalla
const camara = new THREE.PerspectiveCamera(
  100,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camara.position.z = 100;

// Renderizador
const renderizador = new THREE.WebGLRenderer({
  canvas: document.querySelector("#miCanvas"),
  antialias: true
});
renderizador.setSize(window.innerWidth, window.innerHeight);

// Agregar una luz Direccional
const luz = new THREE.DirectionalLight("#ffffff", 1);
luz.position.set(5, 5, 5);
escena.add(luz);


// Función para crear y agregar una galaxia de puntos a una escena
function crearGalaxia({ escena, numEstrellas = 5000, brazos = 3, radio = 20, color = 0xffffff, size = 0.05, x = 0, y = 0, z = 0 } = {}) {
  const puntos2D = [];
  for (let i = 0; i < numEstrellas; i++) {
    // Radio aleatorio
    const r = Math.random() * radio;
    // Ángulo con distribución por brazos
    const branch = i % brazos;
    const theta = (i / numEstrellas) * Math.PI * 4 + (branch * (2 * Math.PI / brazos));
    // Espiral + ruido
    const px = r * Math.cos(theta) + (Math.random() - 0.5);
    const py = r * Math.sin(theta) + (Math.random() - 0.5);
    puntos2D.push(new THREE.Vector2(px, py));
  }
  const puntos3D = puntos2D.map(p => new THREE.Vector3(p.x, p.y, (Math.random() - 0.5) * 2));
  const geometria = new THREE.BufferGeometry().setFromPoints(puntos3D);
  const material = new THREE.PointsMaterial({ color, size });
  const galaxia = new THREE.Points(geometria, material);
  galaxia.position.set(x, y, z);
  if (escena) escena.add(galaxia);
  return galaxia;
}

// Crear y agregar varias galaxias a la escena
const galaxia = crearGalaxia({ escena, x: 1, y: 0, z: 0 });
const galaxia1 = crearGalaxia({ escena, x: 150, y: 10, z: 9 });
const galaxia2 = crearGalaxia({ escena, x: -50, y: 20, z: 19 });

// Función para animar una galaxia (rotación y movimiento)
function animarGalaxia(galaxia) {
  galaxia.rotation.z += 0.01; // Velocidad constante
  galaxia.rotation.y += 0.001; // Velocidad constante
  galaxia.rotation.x += 0.001; // Velocidad constante
  galaxia.position.x += 0.01; // Velocidad constante
}



// Animación 
function animar() {
  requestAnimationFrame(animar);

  // Aplicar animación a galaxias
  animarGalaxia(galaxia);
  animarGalaxia(galaxia1);
  animarGalaxia(galaxia2);

  // Llamado al renderizador
  renderizador.render(escena, camara);
}
animar();
