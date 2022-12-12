import "./styles.css"; // keep this here!

// naimportujte vše co je potřeba z BabylonJS
import {
  Engine,
  Scene,
  UniversalCamera,
  MeshBuilder,
  Path3D,
  StandardMaterial,
  DirectionalLight,
  Vector3,
  Axis,
  Space,
  Color3,
  SceneLoader,
  DeviceOrientationCamera,
  Mesh,
  Animation,
  AbstractMesh
} from "@babylonjs/core";
import "@babylonjs/inspector";

//canvas je grafické okno, to rozáhneme přes obrazovku
const canvas = document.getElementById("renderCanvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const engine = new Engine(canvas, true);

//scéna neměnit
const scene = new Scene(engine);
// Default Environment

//vytoření kamery v pozici -5 (dozadu)
const camera = new DeviceOrientationCamera(
  "kamera",
  new Vector3(1, 1, 10),
  scene
);

//zaměřit kameru do středu
camera.setTarget(new Vector3(0, 1, 0));

//spojení kamery a grafikcého okna
camera.attachControl(canvas, true);

//zde přídáme cyklus for

//světlo
const light1 = new DirectionalLight(
  "DirectionalLight",
  new Vector3(-1, -1, -1),
  scene
);
//vytvoření cesty
var points = [];
var n = 450; //pocet bodu
var r = 120; //radius krivky
for (var i = 0; i < n + 1; i++) {
  points.push(
    new Vector3(
      (r + (r / 5) * Math.sin((8 * i * Math.PI) / n)) *
        Math.sin((2 * i * Math.PI) / n),
      0,
      (r + (r / 10) * Math.sin((6 * i * Math.PI) / n)) *
        Math.cos((2 * i * Math.PI) / n)
    )
  );
}
//vykreslení křivky
var track = MeshBuilder.CreateLines("track", { points: points });
var ufo = MeshBuilder.CreateCylinder("ufo", { diameter: 0.00001 });
SceneLoader.ImportMesh("", "public/", "ufo.glb", scene, function (newMeshes) {
  // Pozice, měřítko a rotace
  newMeshes[0].scaling = new Vector3(1, 1, 1);
  newMeshes[0].rotate(new Vector3(0, 1, 0), Math.PI / 2);
  newMeshes[0].position.z = 0;
  newMeshes[0].position.x = 0;
  newMeshes[0].position.y = 50;
  ufo = newMeshes[0];
  //var i = 0;
  for (i = 0; i < 0; i++) {
    ufo = newMeshes[0].clone("ufo" + i, newMeshes[0].parent, false);
    ufo.position.x = 1 - i;
  }
});
//barvy
var planeta = Mesh.CreateSphere("sphere1", 20, 20, scene);
planeta.position.y = 60;
var planeta1 = Mesh.CreateSphere("sphere2", 20, 20, scene);
planeta1.position.y = 60;
planeta1.position.x = 150;
var planeta2 = Mesh.CreateSphere("sphere3", 20, 20, scene);
planeta2.position.y = 60;
planeta2.position.x = -150;
//var ground = Mesh.CreateGround("ground1", 400, 400, 400, scene);

// mat. zem
//var material = new StandardMaterial(scene);
//material.diffuseColor = new Color3 (140,70,20);
//ground.material = material;

//mat. planeta
var material1 = new StandardMaterial(scene);
material1.diffuseColor = new Color3(12, 255, 255);
planeta.material = material1;
planeta1.material = material1;

//mat track
var material2 = new StandardMaterial(scene);
material2.diffuseColor = new Color3(0, 0, 0);
track.material = material2;

//úhly a rotace
var path3d = new Path3D(points);
var normals = path3d.getNormals();
var theta = Math.acos(Vector3.Dot(Axis.Z, normals[0]));
ufo.rotate(Axis.X, theta + 5, Space.WORLD);

scene.registerBeforeRender(function () {});
//animace
var i = 0;
scene.registerAfterRender(function () {
  ufo.position.x = points[i].x;
  ufo.position.z = points[i].z;
  theta = Math.acos(Vector3.Dot(normals[0], normals[i + 1]));
  var sklopeni = Vector3.Cross(normals[i], normals[i + 1]).y;
  sklopeni = sklopeni / Math.abs(sklopeni);
  ufo.rotate(Axis.Y, sklopeni * theta, Space.WORLD);
  i = (i + 1) % (n - 1);
});

// povinné vykreslování
engine.runRenderLoop(function () {
  scene.render();
});
//barva
const environment1 = scene.createDefaultEnvironment({
  enableGroundShadow: true
});

// zde uděláme VR prostředí
const xrHelper = scene.createDefaultXRExperienceAsync({
  floorMeshes: environment1.ground
});
environment1.setMainColor(Color3.FromHexString("#1b9ff"));
