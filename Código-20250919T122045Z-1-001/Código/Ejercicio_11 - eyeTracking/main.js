
// Entrenamiento guiado de WebGazer antes de iniciar la detección de mirada
window.addEventListener('DOMContentLoaded', () => {
  if (window.webgazer) {
    // Mostrar instrucciones y puntos de calibración
    mostrarEntrenamientoWebGazer();
  } else {
    console.error('WebGazer no está disponible.');
  }
});

function mostrarEntrenamientoWebGazer() {
  // Crear overlay de entrenamiento
  const overlay = document.createElement('div');
  overlay.id = 'webgazer-training-overlay';
  overlay.style.position = 'fixed';
  overlay.style.top = '0';
  overlay.style.left = '0';
  overlay.style.width = '100vw';
  overlay.style.height = '100vh';
  overlay.style.background = 'rgba(0,0,0,0.7)';
  overlay.style.zIndex = '9999';
  overlay.style.display = 'flex';
  overlay.style.flexDirection = 'column';
  overlay.style.alignItems = 'center';
  overlay.style.justifyContent = 'center';
  overlay.innerHTML = `
    <div style="color:white; font-size:1.5em; margin-bottom:20px; text-align:center;">
      Entrenamiento de seguimiento ocular<br>
      Mira los puntos que aparecerán en pantalla y haz clic en cada uno.<br>
      <span style="font-size:1em;">(Esto ayuda a calibrar el sistema)</span>
    </div>
    <div id="webgazer-calibration-area" style="position:relative; width:80vw; height:60vh;"></div>
    <button id="webgazer-training-done" style="margin-top:30px; font-size:1.2em; padding:10px 30px;">Comenzar</button>
  `;
  document.body.appendChild(overlay);

  const area = document.getElementById('webgazer-calibration-area');
  const puntos = [
    {x:0.1, y:0.1}, {x:0.5, y:0.1}, {x:0.9, y:0.1},
    {x:0.1, y:0.5}, {x:0.5, y:0.5}, {x:0.9, y:0.5},
    {x:0.1, y:0.9}, {x:0.5, y:0.9}, {x:0.9, y:0.9}
  ];
  let actual = 0;
  let muestrasPorPunto = 10;
  let muestras = 0;

  function mostrarPunto(i) {
    area.innerHTML = '';
    const punto = document.createElement('div');
    punto.style.position = 'absolute';
    punto.style.width = '40px';
    punto.style.height = '40px';
    punto.style.borderRadius = '50%';
    punto.style.background = 'red';
    punto.style.left = `calc(${puntos[i].x*100}% - 20px)`;
    punto.style.top = `calc(${puntos[i].y*100}% - 20px)`;
    punto.style.display = 'flex';
    punto.style.alignItems = 'center';
    punto.style.justifyContent = 'center';
    punto.style.cursor = 'pointer';
    punto.style.boxShadow = '0 0 20px 5px #fff';
    punto.title = 'Haz clic aquí para registrar tu mirada';
    area.appendChild(punto);

    muestras = 0;
    punto.addEventListener('click', () => {
      recolectarMuestras(i);
    });
  }

  function recolectarMuestras(i) {
    // Toma varias muestras para este punto
    muestras = 0;
    const intervalo = setInterval(() => {
      webgazer.recordScreenPosition(puntos[i].x * window.innerWidth, puntos[i].y * window.innerHeight, 'click');
      muestras++;
      if (muestras >= muestrasPorPunto) {
        clearInterval(intervalo);
        actual++;
        if (actual < puntos.length) {
          mostrarPunto(actual);
        } else {
          finalizarEntrenamiento();
        }
      }
    }, 80);
  }

  mostrarPunto(actual);

  document.getElementById('webgazer-training-done').onclick = () => {
    finalizarEntrenamiento();
  };

  function finalizarEntrenamiento() {
    overlay.remove();
    iniciarWebGazer();
  }
}

// --- Raycaster y lógica de giro del cubo por mirada ---
let ultimaMirada = { x: null, y: null };
let cuboGirando = false;
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

function iniciarWebGazer() {
  webgazer.setRegression('ridge')
    .setGazeListener(function(data, elapsedTime) {
      if (data == null) {
        return;
      }
      // Guardar la última posición de la mirada
      ultimaMirada.x = data.x;
      ultimaMirada.y = data.y;
      // Mostrar en consola de depuración
      console.log(`Gaze: x=${data.x}, y=${data.y}`);
    })
    .begin();
  // Opcional: mostrar u ocultar video y overlays
  webgazer.showVideo(true).showFaceOverlay(true).showFaceFeedbackBox(true);
}






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

// Cubo
const geometriaCubo = new THREE.BoxGeometry(1, 1, 1);
const materialCubo = new THREE.MeshStandardMaterial({ color: 0x0077ff });
const cubo = new THREE.Mesh(geometriaCubo, materialCubo);
escena.add(cubo);






// Animación 

function animar() {
  requestAnimationFrame(animar);

  // Si hay datos de mirada, lanzar rayo
  if (ultimaMirada.x !== null && ultimaMirada.y !== null) {
    // Normalizar coordenadas de pantalla a -1..1 para Three.js
    mouse.x = (ultimaMirada.x / window.innerWidth) * 2 - 1;
    mouse.y = -((ultimaMirada.y / window.innerHeight) * 2 - 1);
    raycaster.setFromCamera(mouse, camara);
    const intersects = raycaster.intersectObject(cubo);
    if (intersects.length > 0) {
      cuboGirando = true;
    } else {
      cuboGirando = false;
    }
  } else {
    cuboGirando = false;
  }

  // Girar el cubo si está siendo "mirado"
  if (cuboGirando) {
    cubo.rotation.y += 0.05;
    cubo.rotation.x += 0.02;
  }

  renderizador.render(escena, camara);
}
animar();
