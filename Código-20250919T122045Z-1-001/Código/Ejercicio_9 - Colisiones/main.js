// Crear la escena
const escena = new THREE.Scene();
escena.background = new THREE.Color("#3e3e3e"); // Verde

// Cámara del tamaño de la pantalla
const camara = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camara.position.z = 6;
camara.position.y = 2;
// Moved camera back so the sphere (at z=7) starts in front of the camera
camara.position.z = 10;

// Renderizador
const renderizador = new THREE.WebGLRenderer({
  canvas: document.querySelector("#miCanvas"),
  antialias: true
});

renderizador.setSize(window.innerWidth, window.innerHeight);

// Grilla para ver piso
escena.add(new THREE.GridHelper(10,20));


// Agregar una luz Direccional
const luz = new THREE.DirectionalLight(0xffffff, 1);
luz.position.set(5, 5, 5);
escena.add(luz);

// Crear geometría y material para el cubo gris
const geometriaCubo = new THREE.BoxGeometry(1, 1, 1);
const materialCubo = new THREE.MeshStandardMaterial({ color: "#cf8282" }); // Gris
const cubo = new THREE.Mesh(geometriaCubo, materialCubo);
cubo.position.set(0, 1, -1);
escena.add(cubo);

// Crear geometría y material para la esfera
const geometriaEsfera = new THREE.SphereGeometry(0.5, 32, 32);
const materialEsfera = new THREE.MeshStandardMaterial({ color: "#82b6cf" });
const esfera = new THREE.Mesh(geometriaEsfera, materialEsfera);
esfera.position.set(0, 1, 7);
escena.add(esfera);

// Variables para animación de la esfera
let esferaEnMovimiento = true;
const velocidadEsfera = 0.02;

// Simple physics state (position is stored in mesh.position)
const estado = {
  esferaVel: new THREE.Vector3(0, 0, -velocidadEsfera),
  cuboVel: new THREE.Vector3(0, 0, 0),
  masaEsfera: 1,
  masaCubo: 3,
  restitucion: 0.3, // how bouncy the collision is (0..1)
  damping: 0.98 // global damping each frame
};

// Animación 
function animar() {
  requestAnimationFrame(animar);

  // Animar la esfera hacia el cubo si está en movimiento
  if (esferaEnMovimiento) {
    // integrate simple velocities
    esfera.position.addScaledVector(estado.esferaVel, 1);
    esfera.rotation.x += 0.05;

    // Update cube by velocity too (cube can be pushed)
    cubo.position.addScaledVector(estado.cuboVel, 1);

    // Check collision using bounding boxes
    const boxCubo = new THREE.Box3().setFromObject(cubo);
    const boxEsfera = new THREE.Box3().setFromObject(esfera);
    if (boxCubo.intersectsBox(boxEsfera)) {
      // Compute a simple impulse along Z between centers
      const normal = new THREE.Vector3().subVectors(esfera.position, cubo.position).normalize();
      // relative velocity along normal
      const relVel = estado.esferaVel.clone().sub(estado.cuboVel);
      const velAlongNormal = relVel.dot(normal);
      if (velAlongNormal < 0) {
        // compute impulse scalar (inelastic)
        const e = estado.restitucion;
        const j = -(1 + e) * velAlongNormal / (1 / estado.masaEsfera + 1 / estado.masaCubo);
        const impulse = normal.clone().multiplyScalar(j);

        // apply impulse
        estado.esferaVel.addScaledVector(impulse, 1 / estado.masaEsfera);
        estado.cuboVel.addScaledVector(impulse, -1 / estado.masaCubo);
      }

      // Stop sphere movement when it's nearly stopped relative to cube (visual)
      if (estado.esferaVel.length() < 0.01) {
        esferaEnMovimiento = false;
        estado.esferaVel.set(0,0,0);
      }
    }

    // Apply damping
    estado.esferaVel.multiplyScalar(estado.damping);
    estado.cuboVel.multiplyScalar(estado.damping);
  }

  // Llamado al renderizador
  renderizador.render(escena, camara);
}
animar();

// Handle window resize
window.addEventListener('resize', () => {
  camara.aspect = window.innerWidth / window.innerHeight;
  camara.updateProjectionMatrix();
  renderizador.setSize(window.innerWidth, window.innerHeight);
});

// Reset positions and velocities with 'R' key
window.addEventListener('keydown', (e) => {
  if (e.key === 'r' || e.key === 'R') {
    esfera.position.set(0,1,7);
    cubo.position.set(0,1,-1);
    estado.esferaVel.set(0,0,-velocidadEsfera);
    estado.cuboVel.set(0,0,0);
    esferaEnMovimiento = true;
  }
});
