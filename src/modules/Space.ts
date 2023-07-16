// dependencies
import * as THREE from "three";
import { 
  GLTFExporter, 
  GLTFExporterOptions 
} from 'three/examples/jsm/exporters/GLTFExporter';
import * as CesiumType from 'cesium';

// modules
import init3D, { 
  Camera 
} from "./Init3D";
import { 
  onAnimate, 
  getGlobeInit, 
  setGlobeInit, 
} from "..";

// configs
const Cesium: typeof CesiumType = window['Cesium'];
Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJhZDM0OTQ5Yi1lYjQ1LTRkMjQtYjllMC00YjkzOWNkZmIzMDYiLCJpZCI6ODIyOTgsImlhdCI6MTY4OTIxODI0MX0.5o0xQ4T4BCI8afp_0lXzjO_wa0kTOkc7dCdCGnJDiro';


// #1
export default function Initgeomap() {

  Cesium.Model
  Cesium.Primitive
  Cesium.Entity

  if (!getGlobeInit()) {
    const cesiumContainer = document.getElementById('somata') as HTMLDivElement;
    const geomap = new Cesium.Viewer(cesiumContainer, {
      contextOptions: {
        webgl: {
          alpha: false,
          antialias: false,
        },
      },
      msaaSamples: 0,
      skyBox: false,
      shadows: false,
      scene3DOnly: true,
      skyAtmosphere: false,
      sceneMode: Cesium.SceneMode.SCENE3D,
      creditContainer: document.getElementById('no-show') as HTMLDivElement, // will be displayed on load and in console instead

      terrain: Cesium.Terrain.fromWorldTerrain(),
      targetFrameRate: 24,
      shouldAnimate: false,

      // Viewer specific clutter elements
      infoBox: false,
      vrButton: false,
      timeline: false,
      geocoder: false,
      animation: false,
      homeButton: false,
      sceneModePicker: false,
      baseLayerPicker: false,
      fullscreenButton: false,
      selectionIndicator: false,
      navigationHelpButton: false,
      navigationInstructionsInitiallyVisible: false,
    });

    // Generate buildings
    Cesium.createOsmBuildingsAsync().then(tileset => geomap.scene.primitives.add(tileset));

    console.debug(geomap.camera.getMagnitude());
    geomap.camera.getPickRay
    geomap.camera.getPixelSize
    geomap.camera.distanceToBoundingSphere
    geomap.scene.cartesianToCanvasCoordinates
    geomap.scene.globe.getHeight
    geomap.scene.globe.material
    geomap.scene.globe.tileLoadProgressEvent
    geomap.scene.globe.translucency
    geomap.scene.preRender

    Cesium.EllipsoidSurfaceAppearance
    geomap.scene.preUpdate
    geomap.scene.postRender
    geomap.scene.postUpdate

    geomap.postProcessStages.add(
      geomap.postProcessStages.ambientOcclusion 
    )
    
    // Swap the rendering canvas to an offscreen instance
    geomap.scene.canvas.style.opacity = '0';

    // Bind underlying canvas for reference by three.js
    window['geomapCanvas'] = geomap.canvas;

    setGlobeInit(true);
    InitHardwareSensors(geomap);

    const ObserverTelemetry = {
      roll: geomap.camera.roll,
      pitch: geomap.camera.pitch,
      heading: geomap.camera.heading,
      position: geomap.camera.position,
      direction: geomap.camera.direction,
      reference: {
        up: geomap.camera.up,
        right: geomap.camera.right,
      }
    };
    geomap.scene.backgroundColor = new Cesium.Color(0, 0, 0, 0);

    // geomap.trackedEntity

    setInterval(() => {

      const upAxisVector = new THREE.Vector3(
        Cesium.Math.toDegrees(geomap.camera.up.x),
        Cesium.Math.toDegrees(geomap.camera.up.y),
        Cesium.Math.toDegrees(geomap.camera.up.z),
      );
      const rightAxisVector = new THREE.Vector3(
        Cesium.Math.toDegrees(geomap.camera.right.x),
        Cesium.Math.toDegrees(geomap.camera.right.y),
        Cesium.Math.toDegrees(geomap.camera.right.z),
      );
      const forwardVector = new THREE.Vector3(
        Cesium.Math.toDegrees(geomap.camera.direction.x),
        Cesium.Math.toDegrees(geomap.camera.direction.y),
        Cesium.Math.toDegrees(geomap.camera.direction.z),
      );
      
      // console.debug(
      //   `\nUp Axis Vector:`,    upAxisVector,
      //   `\nRight Axis Vector:`, rightAxisVector,
      //   `\nForward Vector:`,    forwardVector
      // );
      }, 1000);

      // Cleanup the Cesium bloat
      document.getElementById('no-show')?.childNodes.forEach(childNode => childNode.remove());

    // Chain to #2
    init3D();

    // use three.js to dynamically generate meshes, export them to gltf, and then load them into Cesium
    // Three's camera, scene, and renderer may not even be needed for it
    const output = new THREE.Scene();
    const g_testBall = new THREE.SphereGeometry();
    const m_testBall = new THREE.MeshBasicMaterial();
    const o_testBall = new THREE.Mesh(g_testBall, m_testBall);

    output.add(o_testBall);
    
    const threeToCesium = new GLTFExporter();
    const exportGLTF = threeToCesium.parse(o_testBall, 
    data => {
      // console.debug(data['buffers'][0]['uri']);
      const getTestModel = Cesium.Model.fromGltfAsync({
        url: data,
        show: true,
        allowPicking: true,
        asynchronous: true,
        backFaceCulling: true,
      });

      getTestModel.then(model => {

        const testget = geomap.entities.getOrCreateEntity('test');
        testget.model = model;
        geomap.trackedEntity = testget;
        // geomap.flyTo(testget)
      });
    }, 
    err => console.error(err), 
    {
      trs: true,
      binary: false /* return as .glb instead of .gltf? */,
      animations: [],
      embedImages: true,
      onlyVisible: true,
    });

    geomap.scene.sunBloom = true;
  }
}

export const SpatialData = {
  orientation: {
    alpha: <number | null> null,
    beta:  <number | null> null,
    gamma: <number | null> null
  },
  acceleration: {
    xAxis: <number | null> null,
    yAxis: <number | null> null,
    zAxis: <number | null> null,
    gravitational:{
      xAxis: <number | null> null,
      yAxis: <number | null> null,
      zAxis: <number | null> null
    },
    pollingRate: 0,
  },
  geolocation: {
    latitude:  <number | null> null,
    longitude: <number | null> null,
    altitude:  <number | null> null,
    heading:   <number | null> null,
    groundSpeed: <number | null> null,
    accuracy: {
      altitude: <number | null> null,
      location: <number | null> null
    },
      queriedAt: 0
  }
};

const InitHardwareSensors = (cesium: CesiumType.CesiumWidget | CesiumType.Viewer) => {

  // Accelerometer polling
  window.ondevicemotion = (accelerometer) => {
    SpatialData.acceleration.xAxis = accelerometer.acceleration?.x || -Infinity;
    SpatialData.acceleration.yAxis = accelerometer.acceleration?.y || -Infinity;
    SpatialData.acceleration.zAxis = accelerometer.acceleration?.z || -Infinity;
    SpatialData.acceleration.gravitational.xAxis = accelerometer.accelerationIncludingGravity?.x || -Infinity;
    SpatialData.acceleration.gravitational.yAxis = accelerometer.accelerationIncludingGravity?.y || -Infinity;
    SpatialData.acceleration.gravitational.zAxis = accelerometer.accelerationIncludingGravity?.z || -Infinity;
  };
  
  // Gyroscope polling
  window.ondeviceorientation = (gyroscope) => {
    SpatialData.orientation.alpha = gyroscope.alpha;
    SpatialData.orientation.beta = gyroscope.beta;
    SpatialData.orientation.gamma = gyroscope.gamma;
  };

  if ('navigator' in window) {

    // External device for Interactron activation (e.g. HID)
    const hid = navigator['hid'];

    // GPS polling
    const geo = navigator.geolocation;
    geo.watchPosition(

      (geoData) => {
        SpatialData.geolocation.latitude = geoData.coords.latitude;
        SpatialData.geolocation.longitude = geoData.coords.longitude;
        SpatialData.geolocation.altitude = geoData.coords.altitude;
        SpatialData.geolocation.accuracy.location = geoData.coords.accuracy;
        SpatialData.geolocation.accuracy.altitude = geoData.coords.altitudeAccuracy;
        SpatialData.geolocation.heading = geoData.coords.heading;
        SpatialData.geolocation.queriedAt = geoData.timestamp;
        SpatialData.geolocation.groundSpeed = geoData.coords.speed;
      },

      (error) => {
        console.error(error);
      },

      /* options */
      {
        timeout: 36000,
        maximumAge: 1200,
        enableHighAccuracy: true,
      }
    );
  }

  // Needs work but this should be able to orient the camera to match the spatial orientation of the user's device
  const updateLocation = () => setTimeout(() => {
    console.debug('updating location data');
    cesium.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(SpatialData.geolocation.longitude || 0, SpatialData.geolocation.latitude || 0, 222),
      // orientation: {
      //   roll: 18.0,
      //   pitch: Cesium.Math.toRadians(90),
      //   heading: Cesium.Math.toRadians(90),
      //   up: new Cesium.Cartesian3(0, -1, 0),
      //   direction: new Cesium.Cartesian3(SpatialData.orientation.beta || 0, SpatialData.orientation.gamma || 0, SpatialData.orientation.alpha || 0),
      // },
      // complete: updateLocation
    });
  }, 1200);

  updateLocation();
}