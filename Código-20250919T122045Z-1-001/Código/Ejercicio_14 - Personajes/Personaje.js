import { GLTFLoader } from './libs/GLTFLoader.js';

export class Personaje {
  constructor(escena, rutaModelo, posicion = { x: -7, z: 0 }, rotacionY = 1.5) {
    this.escena = escena;
    this.modeloGLTF = null;
    this.mixer = null;
    this.animaciones = {};
    this.acciones = {};
    this.animacionActual = null;
    this.cargado = false;
    this.clock = new THREE.Clock();

    const loader = new GLTFLoader();
    loader.load(
      rutaModelo,
      (gltf) => {
        gltf.scene.position.x = posicion.x;
        gltf.scene.position.z = posicion.z;
        gltf.scene.rotation.y = rotacionY;
        this.escena.add(gltf.scene);
        this.modeloGLTF = gltf.scene;
        if (gltf.animations && gltf.animations.length > 0) {
          this.mixer = new THREE.AnimationMixer(gltf.scene);
          gltf.animations.forEach((clip) => {
            this.animaciones[clip.name] = clip;
            this.acciones[clip.name] = this.mixer.clipAction(clip);
          });
          this.animacionActual = gltf.animations[0].name;
          this.acciones[this.animacionActual].play();
        }
        this.cargado = true;
      },
      undefined,
      (error) => {
        console.error('Error al cargar el modelo GLTF:', error);
      }
    );
  }

  moverX(deltaX) {
    if (this.modeloGLTF) {
      this.modeloGLTF.position.x += deltaX;
    }
  }

  actualizarAnimacion() {
    if (this.mixer) {
      let delta = this.clock.getDelta();
      this.mixer.update(delta);
    }
  }

  cambiarAnimacionPorIndice(indice) {
    const nombres = Object.keys(this.animaciones);
    if (nombres.length === 0) return;
    const nuevaAnimacion = nombres[indice] || nombres[0];
    if (nuevaAnimacion !== this.animacionActual) {
      if (this.animacionActual && this.acciones[this.animacionActual]) {
        this.acciones[this.animacionActual].stop();
      }
      this.acciones[nuevaAnimacion].reset().play();
      this.animacionActual = nuevaAnimacion;
    }
  }
}
