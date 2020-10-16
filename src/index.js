import vs from "./pos.vert";
import shader from "./shader.frag";
import * as THREE from "three";

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
var geometry = new THREE.PlaneGeometry(16, 10);
var material = new THREE.MeshBasicMaterial({
  color: 0xffff00,
  side: THREE.DoubleSide,
});
var plane = new THREE.Mesh(geometry, material);
scene.add(plane);

camera.position.z = 10;

var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();
