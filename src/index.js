import vs from "./pos.vert";
import shader from "./shader.frag";
import * as THREE from "three";

const btn = document.createElement("button");
btn.innerHTML = "Start";
btn.id = "btnStart";
btn.style = "float: right;";
document.body.appendChild(btn);

const video = document.createElement("video");
video.style = "float:left;";
document.body.appendChild(video);

const gl_div = document.createElement("div");
gl_div.width = 640;
gl_div.height = 480;

document.body.appendChild(gl_div);

btn.addEventListener("click", async () => {
  const stream = await navigator.mediaDevices.getUserMedia({
    audio: false,
    video: {
      facingMode: "user",
      width: 640,
      height: 480,
    },
  });

  video.srcObject = stream;
  await video.play();

  var texture = new THREE.VideoTexture(video);
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.format = THREE.RGBFormat;

  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(
    75,
    // window.innerWidth / window.innerHeight,
    12.0 / 9.0,
    0.1,
    1000
  );

  var geometry = new THREE.PlaneGeometry(12.0, 9.0);
  var material = new THREE.MeshBasicMaterial({
    // color: 0xffff00,
    // side: THREE.DoubleSide,
    map: texture,
  });

  var plane = new THREE.Mesh(geometry, material);
  scene.add(plane);

  camera.position.z = 10;

  var renderer = new THREE.WebGLRenderer();
  renderer.setSize(640, 480);
  gl_div.appendChild(renderer.domElement);

  function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
  }
  animate();
});
