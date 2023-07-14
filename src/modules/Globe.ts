import init3D from "./Init3D";
import * as CesiumType from 'cesium';

const Cesium: typeof CesiumType = window['Cesium'];
Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJhZDM0OTQ5Yi1lYjQ1LTRkMjQtYjllMC00YjkzOWNkZmIzMDYiLCJpZCI6ODIyOTgsImlhdCI6MTY4OTIxODI0MX0.5o0xQ4T4BCI8afp_0lXzjO_wa0kTOkc7dCdCGnJDiro';

// #1
export default function InitGlobe() {
  const globeContainer = document.getElementById('somata') as HTMLDivElement;
  const viewer = new Cesium.Viewer(globeContainer);

  // Chain to #2
  // init3D();
}