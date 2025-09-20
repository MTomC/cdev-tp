

// Solución: reanudar AudioContext tras interacción del usuario
window.addEventListener('click', () => {
  let ctx = null;
  if (THREE && THREE.AudioContext && THREE.AudioContext.getContext) {
    ctx = THREE.AudioContext.getContext();
  } else if (window.AudioContext) {
    ctx = window.AudioContext;
  }
  if (ctx && ctx.state === 'suspended') {
    ctx.resume();
  }
  // Reanudar contexto de todos los sonidos si es necesario
  if (Array.isArray(sonidos)) {
    sonidos.forEach(snd => {
      if (snd && snd.context && snd.context.state === 'suspended') {
        snd.context.resume();
      }
    });
  }
}, { once: true });




// --- BASE MUSICAL ---
let baseAudio = null;
let baseLoaded = false;
let btnBase = null;




// Crear la escena
const escena = new THREE.Scene();
escena.background = new THREE.Color("#000000"); 

// Cámara del tamaño de la pantalla
const camara = new THREE.PerspectiveCamera(
  100,
  window.innerWidth / window.innerHeight,
  0.1,
  10
);
camara.position.z = 5;


// Luz direccional que enfoque el piano
const luzDireccional = new THREE.DirectionalLight(0xffffff, 1);
luzDireccional.position.set(5, 5, 5);
escena.add(luzDireccional);

// Renderizador
const renderizador = new THREE.WebGLRenderer({
  canvas: document.querySelector("#miCanvas"),
  antialias: true
});
renderizador.setSize(window.innerWidth, window.innerHeight);


// Ajustar al cambiar tamaño ventana
window.addEventListener('resize', () => {
  camara.aspect = window.innerWidth / window.innerHeight;
  camara.updateProjectionMatrix();
  renderizador.setSize(window.innerWidth, window.innerHeight);
});

// Cargar sonidos para cada tecla
const listener = new THREE.AudioListener();
camara.add(listener);

// Inicializar base musical después de tener listener
btnBase = document.getElementById('btnBase');
if (btnBase) {
  baseAudio = new THREE.Audio(listener);
  const baseLoader = new THREE.AudioLoader();
  baseLoader.load('assets/sounds/Base.mp3', function(buffer) {
    baseAudio.setBuffer(buffer);
    baseAudio.setLoop(true);
    baseAudio.setVolume(0.4);
    baseLoaded = true;
  });
  btnBase.addEventListener('click', () => {
    if (!baseLoaded) return;
    if (baseAudio.isPlaying) {
      baseAudio.pause();
    } else {
      baseAudio.play();
    }
  });
}

const audioLoader = new THREE.AudioLoader();
const rutasSonidos = [
  'assets/sounds/1.mp3',
  'assets/sounds/2.mp3',
  'assets/sounds/30.mp3',
  'assets/sounds/31.mp3',
  'assets/sounds/33.mp3',
  'assets/sounds/5.mp3',
  'assets/sounds/4.mp3',
];
const sonidos = [];
for (let i = 0; i < 7; i++) {
  const audio = new THREE.Audio(listener);
  audioLoader.load(rutasSonidos[i], function(buffer) {
    audio.setBuffer(buffer);
    audio.setLoop(false);
    audio.setVolume(0.4);
  });
  sonidos.push(audio);
}

// Crear 7 teclas de piano (cubos)
const teclas = [];
const materiales = [];
const geometria = new THREE.BoxGeometry(0.8, 2, 0.5);
for (let i = 0; i < 7; i++) {
  const color = new THREE.Color(`hsl(${i * 30}, 70%, 70%)`);
  const material = new THREE.MeshPhongMaterial({ color });
  materiales.push(material);
  const tecla = new THREE.Mesh(geometria, material);
  tecla.position.set(i - 3, 0, 0); // Alinear en X
  escena.add(tecla);
  teclas.push(tecla);
}


// Raycaster para detectar mouse sobre teclas
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let teclaActual = null;
let tecla = null; // Declarar la variable globalmente

function onMouseMove(event) {
  // Normalizar coordenadas mouse (-1 a 1)
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
}
window.addEventListener('mousemove', onMouseMove, false);

// Reproducir sonido al pasar el mouse por encima de una tecla
function detectarTeclaHover() {
  raycaster.setFromCamera(mouse, camara);
  const intersects = raycaster.intersectObjects(teclas);
  if (intersects.length > 0) {
    tecla = intersects[0].object;
    const idx = teclas.indexOf(tecla);
    if (teclaActual !== tecla) {
      teclaActual = tecla;
      if (idx >= 0 && sonidos[idx]) {
        if (sonidos[idx].isPlaying) sonidos[idx].stop();
        sonidos[idx].play();
      }
      // Efecto visual: resaltar
      tecla.rotation.x = -0.1;
    }
  } else {
    if (tecla) tecla.rotation.x = 0.1;
  }
}


// Animación 
function animar() {
  requestAnimationFrame(animar);
  detectarTeclaHover();
  renderizador.render(escena, camara);
}
animar();
