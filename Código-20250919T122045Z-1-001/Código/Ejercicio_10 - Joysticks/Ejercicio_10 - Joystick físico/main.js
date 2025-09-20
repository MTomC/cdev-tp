// Crear la escena
const escena = new THREE.Scene();
escena.background = new THREE.Color("#ef7171"); 

// No se carga joystick virtual. Se usará joystick físico (Gamepad API)

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


// Animación usando Gamepad API
function getGamepadState() {
  const gamepads = navigator.getGamepads ? navigator.getGamepads() : [];
  if (gamepads && gamepads[0]) {
    // Ejes estándar: 0 = X, 1 = Y
    const x = gamepads[0].axes[0] || 0;
    const y = gamepads[0].axes[1] || 0;
    // Botón 0 (A en la mayoría de los controles)
    const buttonPressed = gamepads[0].buttons && gamepads[0].buttons[0] && gamepads[0].buttons[0].pressed;
    return { x, y, buttonPressed };
  }
  return { x: 0, y: 0, buttonPressed: false };
}

function animar() {
  requestAnimationFrame(animar);

  // Leer valores del joystick físico y botón
  const { x, y, buttonPressed } = getGamepadState();
  // Mover el cubo en x/y (horizontal/vertical) y z (profundidad)
  cubo.position.x += x * 0.9;
  cubo.position.z += y * 0.9;

  // Rotación normal
  let rotSpeed = 0.01;
  // Si el botón está presionado, acelerar la rotación
  if (buttonPressed) {
    rotSpeed = 100;
  }
  cubo.rotation.x += rotSpeed;
  cubo.rotation.y += rotSpeed;

  renderizador.render(escena, camara);
}
animar();
