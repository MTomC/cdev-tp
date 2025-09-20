// Crear la escena
const escena = new THREE.Scene();
escena.background = new THREE.Color("#ef7171"); 

// Cargar el joystick virtual
const scriptJoystick = document.createElement('script');
scriptJoystick.src = 'libs/simple-joystick.js';
document.head.appendChild(scriptJoystick);

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




// Esperar a que el joystick esté disponible
scriptJoystick.onload = () => {
  // Crear el joystick
  const joystick = new window.SimpleJoystick();

  // Estilos para el joystick
  const style = document.createElement('style');
  style.textContent = `
    .joystick-base {
      position: fixed;
      left: 30px;
      bottom: 30px;
      width: 120px;
      height: 120px;
      background: rgba(0,0,0,0.2);
      border-radius: 50%;
      z-index: 1000;
      touch-action: none;
      user-select: none;
    }
    .joystick-stick {
      position: absolute;
      left: 50%;
      top: 50%;
      width: 60px;
      height: 60px;
      background: rgba(255,255,255,0.7);
      border-radius: 50%;
      transform: translate(-50%, -50%);
      pointer-events: none;
    }
  `;
  document.head.appendChild(style);

  // Animación
  function animar() {
    requestAnimationFrame(animar);

    // Leer valores del joystick
    const { x, y } = joystick.getAxis();
    // Mover el cubo en x/y (horizontal/vertical) y z (profundidad)
    cubo.position.x += x * 0.1;
    cubo.position.z += y * 0.1;

    // Limitar el rango de movimiento
    // cubo.position.x = Math.max(-5, Math.min(5, cubo.position.x));
    // cubo.position.z = Math.max(-5, Math.min(5, cubo.position.z));

    // Hacer girar el cubo
    cubo.rotation.x += 0.01;
    cubo.rotation.y += 0.01;

    renderizador.render(escena, camara);
  }
  animar();
};
