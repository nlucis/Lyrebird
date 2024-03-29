import initUI, { UI, UICanvas, stage } from "./InitUI";
import * as THREE from 'three';
;
import { SMAAPass } from 'three/examples/jsm/postprocessing/SMAAPass';
import { FilmPass } from 'three/examples/jsm/postprocessing/FilmPass';
import { TexturePass } from 'three/examples/jsm/postprocessing/TexturePass';
import { TAARenderPass } from 'three/examples/jsm/postprocessing/TAARenderPass';
import {UnrealBloomPass} from 'three/examples/jsm/postprocessing/UnrealBloomPass';
import {EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { ArcballControls } from 'three/examples/jsm/controls/ArcballControls';
import { geomap } from "./Space";
import * as PIXI from 'pixi.js';
import { renderTarget } from "..";

export let Camera: THREE.PerspectiveCamera;
export let Renderer: THREE.WebGLRenderer;
export const Scene: THREE.Scene = new THREE.Scene();


// #3
export default function init3D() {
  const target = document.getElementById('target') as HTMLCanvasElement;

  // Lights..., 
  Renderer = new THREE.WebGLRenderer({ canvas: target, alpha: true });
  Renderer.setSize(window.innerWidth, window.innerHeight);
  Renderer.setPixelRatio(window.devicePixelRatio);
  Renderer.toneMapping = THREE.CineonToneMapping;

  // camera...
  Camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 1e-1, 1e+3);
  Camera.position.set(0, 0, -100);

  // controls...
  const controls = new ArcballControls(Camera, target, Scene);
  controls.camera = Camera;
  controls.setTbRadius(0.3);
  controls.radiusFactor = 120;
  controls.enableAnimations = true;
  controls.setGizmosVisible(false);

  // Allow rotation only
  controls.enablePan = false;
  controls.enableZoom = false;
  controls.enableRotate = true;

  // Info Sphere - Point Grid
  const gPoints = new THREE.IcosahedronGeometry(2, 6);
  const mPoints = new THREE.PointsMaterial({
    name: 'point-sphere',
    color: 0x1A9CEC,
    size: 0.1,
    opacity: 1.0,
    blending: THREE.AdditiveBlending,
  });


  const Visualizer = new THREE.Points(gPoints, mPoints);
  PIXI.Ticker.shared.add(() => {
    Visualizer.rotation.x += 0.006;
    Visualizer.rotation.y -= 0.003;
    Visualizer.rotation.z += 0.009;
  });
  Visualizer.position.set(0, 23.65, 0);

  Scene.add(Visualizer);
  // Simulate vox flashing
  let opacityMax = 3.0;
  let opacityMin = 0.3;
  setInterval(() => {
    mPoints.opacity = THREE.MathUtils.randFloat(opacityMin, opacityMax);
  }, 64);

  // Convert the Cesium globe canvas to a texture for layering as well
  // const cesiumTex = new THREE.CanvasTexture(window['geomapCanvas']);

  // Post-Processing
  const composer = new EffectComposer(Renderer);
  const bloom = new UnrealBloomPass(
    new THREE.Vector2(1000, 1000), 
    /* Strength */0.369, 
    /* Radius   */0.222, 
    /* Threshold*/0.012
  );
  const smaa = new SMAAPass(window.innerWidth, window.innerHeight);
  const scan = new FilmPass(
    0.12,
    0.72,
    window.innerHeight * 2.0,
    0
  );

  const phaserTex = new THREE.CanvasTexture(renderTarget);

  /* NOTE: clear alphas must be a value less than 1 or the TAA pass wont show */
  composer.addPass(new TAARenderPass(Scene, Camera, 0x1A1A27, 0.3));
  composer.addPass(new TexturePass(phaserTex, 0.64)); // if the alpha is too high, bloom ends up over-exposing the layer

  composer.addPass(bloom);
  composer.addPass(scan);
  composer.addPass(smaa);

  PIXI.Ticker.shared.add(() => {
    phaserTex.needsUpdate = true;
    // geomap.render();
    composer.render();
  }); 

  // Chain #4
  // initUI();
}