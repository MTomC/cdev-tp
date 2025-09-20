// --- JOYSTICK VIRTUAL ---
let joystick = {
  dragging: false,
  startX: 0,
  startY: 0,
  dx: 0,
  dy: 0
};

const stick = document.getElementById('joystick-stick');
const base = document.getElementById('joystick-base');
const container = document.getElementById('joystick-container');

function getEventXY(e) {
  if (e.touches && e.touches.length > 0) {
    return { x: e.touches[0].clientX, y: e.touches[0].clientY };
  } else {
    return { x: e.clientX, y: e.clientY };
  }
}

function joystickStart(e) {
  e.preventDefault();
  joystick.dragging = true;
  const pos = getEventXY(e);
  const rect = base.getBoundingClientRect();
  joystick.startX = pos.x - rect.left - 50;
  joystick.startY = pos.y - rect.top - 50;
}

function joystickMove(e) {
  if (!joystick.dragging) return;
  const pos = getEventXY(e);
  const rect = base.getBoundingClientRect();
  let dx = pos.x - rect.left - 50;
  let dy = pos.y - rect.top - 50;
  const dist = Math.sqrt(dx*dx + dy*dy);
  if (dist > 40) {
    dx = dx * 40 / dist;
    dy = dy * 40 / dist;
  }
  stick.style.left = (25 + dx) + 'px';
  stick.style.top = (25 + dy) + 'px';
  joystick.dx = dx / 40;
  joystick.dy = dy / 40;
}

function joystickEnd(e) {
  joystick.dragging = false;
  stick.style.left = '25px';
  stick.style.top = '25px';
  joystick.dx = 0;
  joystick.dy = 0;
}

base.addEventListener('mousedown', joystickStart);
base.addEventListener('touchstart', joystickStart);
window.addEventListener('mousemove', joystickMove);
window.addEventListener('touchmove', joystickMove);
window.addEventListener('mouseup', joystickEnd);
window.addEventListener('touchend', joystickEnd);


//---------------------------------------------------------------------------

// Crear la escena
const escena = new THREE.Scene();
escena.background = new THREE.Color("#000000");

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


//CUBOS---------------------------------------------------------------------------
// Central
const geometriaCubo = new THREE.BoxGeometry(1, 1, 1);
const materialCubo = new THREE.MeshStandardMaterial({ color: 0x888888 }); // Gris
const cubo = new THREE.Mesh(geometriaCubo, materialCubo);
escena.add(cubo);

// Derecha
const geometriaCubo2 = new THREE.BoxGeometry(1, 1, 1);
const materialCubo2 = new THREE.MeshStandardMaterial({ color: 0x888888 }); // Gris
const cubo2 = new THREE.Mesh(geometriaCubo2, materialCubo2);
escena.add(cubo2);
cubo2.position.x = 5; // Mover el segundo cubo a la derecha

// Izquierda
const geometriaCubo3 = new THREE.BoxGeometry(1, 1, 1);
const materialCubo3 = new THREE.MeshStandardMaterial({ color: 0x888888 }); // Gris
const cubo3 = new THREE.Mesh(geometriaCubo3, materialCubo3);
escena.add(cubo3);
cubo3.position.x = -5; // Mover el tercer cubo a la izquierda


//---------------------------------------------------------------------------


// --- LUCES Y ESFERAS ---
// 1. Luz ambiental (no tiene posición, pero agregamos una esfera en el centro)
const luzAmbiental = new THREE.AmbientLight("#ffffff", 0.5);
escena.add(luzAmbiental);
const esferaAmbiental = new THREE.Mesh(
  new THREE.SphereGeometry(0.1, 16, 16),
  new THREE.MeshStandardMaterial({ color: "#ffffff" })
);
esferaAmbiental.position.set(0, 0, 3);
escena.add(esferaAmbiental);


// 2. Luz direccional
const luzDireccional = new THREE.DirectionalLight("#50e211", 0.7);
luzDireccional.position.set(2, 2, 2);
escena.add(luzDireccional);
const esferaDireccional = new THREE.Mesh(
  new THREE.SphereGeometry(0.1, 16, 16),
  new THREE.MeshStandardMaterial({ color: "#50e211" })
);
esferaDireccional.position.copy(luzDireccional.position);
escena.add(esferaDireccional);

// 3. Luz puntual
const luzPuntual = new THREE.PointLight("#116ce2" , 1, 100);
luzPuntual.position.set(-2, 2, 2);
escena.add(luzPuntual);
const esferaPuntual = new THREE.Mesh(
  new THREE.SphereGeometry(0.1, 16, 16),
  new THREE.MeshStandardMaterial({ color: "#116ce2" })
);
esferaPuntual.position.copy(luzPuntual.position);
escena.add(esferaPuntual);

// 4. Luz spot
const luzSpot = new THREE.SpotLight("#ee12f2", 1);
luzSpot.position.set(0, -2, 2);
escena.add(luzSpot);
const esferaSpot = new THREE.Mesh(
  new THREE.SphereGeometry(0.1, 16, 16),
  new THREE.MeshStandardMaterial({ color: "#ee12f2" })
);
esferaSpot.position.copy(luzSpot.position);
escena.add(esferaSpot);


// --- INTERACCIÓN CON ESFERAS Y LUCES ---
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

// Relacionar cada esfera con su luz
const esferasYLuces = [
  { esfera: esferaAmbiental, luz: luzAmbiental },
  { esfera: esferaDireccional, luz: luzDireccional },
  { esfera: esferaPuntual, luz: luzPuntual },
  { esfera: esferaSpot, luz: luzSpot }
];

function onClick(event) {
  // Calcular posición normalizada del mouse (-1 a 1)
  const rect = renderizador.domElement.getBoundingClientRect();
  mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

  raycaster.setFromCamera(mouse, camara);
  const objetos = esferasYLuces.map(e => e.esfera);
  const intersects = raycaster.intersectObjects(objetos);
  if (intersects.length > 0) {
    const intersected = intersects[0].object;
    const relacion = esferasYLuces.find(e => e.esfera === intersected);
    if (relacion) {
      // Alternar luz
      relacion.luz.visible = !relacion.luz.visible;
    }
  }
}

renderizador.domElement.addEventListener('click', onClick);


// Animación 
function animar() {
  requestAnimationFrame(animar); 


  // Mover el cubo con el joystick
  cubo.position.x += joystick.dx * 0.1;
  cubo.position.y -= joystick.dy * 0.1;

  // Hacer girar el cubo
  cubo.rotation.x += 0.01;
  cubo.rotation.y += 0.01;

  // Llamado al renderizador
  renderizador.render(escena, camara);
}
animar();
