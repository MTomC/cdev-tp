
let escena, camara, renderizador, luz;


function inicializacion() {
  // Crear la escena
  escena = new THREE.Scene();
  escena.background = new THREE.Color("#26397D"); // Verde

  // Cámara del tamaño de la pantalla
  camara = new THREE.PerspectiveCamera(
    100,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camara.position.x = 0;
  camara.position.y = 0;
  camara.position.z =6;
  // Renderizador
  renderizador = new THREE.WebGLRenderer({
    canvas: document.querySelector("#miCanvas"),
    antialias: true
  });
  renderizador.setSize(window.innerWidth, window.innerHeight);

  // Luz para que se vea la textura con efecto 3D
  luz = new THREE.DirectionalLight(0xffffff, 1);
  luz.position.set(2, 2, 2);
  escena.add(luz);
}
inicializacion();



let esfera;
function crearEsferaConTextura() {
  // Cargar la textura 
  const loader = new THREE.TextureLoader();
  const textura = loader.load('assets/textures/Planeta.png');

  // Crear la esfera con la textura
  const geometria = new THREE.SphereGeometry(1, 64, 64);
  const material = new THREE.MeshStandardMaterial({ map: textura });
  esfera = new THREE.Mesh(geometria, material);
  esfera.position.set(1, 0, 0); // Centrar la esfera en la escena
  escena.add(esfera);
}
crearEsferaConTextura();



// Animación 
function animar() {
  requestAnimationFrame(animar);
  
  esfera.rotation.y += 0.01;
  esfera.rotation.x += 0.005;
  esfera.position.x += 0.001;
    
  renderizador.render(escena, camara);
}
animar();
