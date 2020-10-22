import vs from "./pos.vert";
import shader from "./shader.frag";
import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { GlitchPass } from "three/examples/jsm/postprocessing/GlitchPass.js";
// import { CopyShader } from "three/examples/jsm/shaders/CopyShader.js";
// import { SepiaShader } from "three/examples/jsm/shaders/SepiaShader.js";
// import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";

const WIDTH = 640.0;
const HEIGHT = 480.0;

const style = document.createElement("style");
style.innerHTML = `ul {
    list-style-type: none;
    margin: 0 0 5 0;
    padding: 0;
    overflow: hidden;
    background-color: #333333;
  }

  li {
    float: left;
  }

  li a {
    display: block;
    color: white;
    text-align: center;
    padding: 16px;
    text-decoration: none;
  }

  li a:hover {
    background-color: #111111;
}`;
document.head.appendChild(style);

const menu = document.createElement("ul");
menu.innerHTML = `<li><a href="#home">Home</a></li><li><a href="#a">A</a></li>`;
document.body.appendChild(menu);

const btn = document.createElement("button");
btn.innerHTML = "Start";
btn.id = "btnStart";
btn.style = "float: right;";
document.body.appendChild(btn);

const btnPlus = document.createElement("button");
btnPlus.innerHTML = "+";
btnPlus.id = "btnPlus";
btnPlus.style = "float: right;";
document.body.appendChild(btnPlus);

const btnMinus = document.createElement("button");
btnMinus.innerHTML = "-";
btnMinus.id = "btnMinus";
btnMinus.style = "float: right;";
document.body.appendChild(btnMinus);

const video = document.createElement("video");
video.style = "float:left;";
document.body.appendChild(video);

const gl_div = document.createElement("div");
gl_div.width = WIDTH;
gl_div.height = HEIGHT;
document.body.appendChild(gl_div);

var renderer = new THREE.WebGLRenderer();
renderer.setSize(WIDTH, HEIGHT);

let mytarget = new THREE.WebGLRenderTarget(WIDTH, HEIGHT);
let effcomposer = new EffectComposer(renderer);

btn.addEventListener("click", async () => {
  btnPlus.addEventListener("click", () => {
    shaderMaterial.uniforms.swtch.value < 5
      ? shaderMaterial.uniforms.swtch.value++
      : 5;
  });

  btnMinus.addEventListener("click", () => {
    shaderMaterial.uniforms.swtch.value > 0
      ? shaderMaterial.uniforms.swtch.value--
      : 0;
  });

  const stream = await navigator.mediaDevices.getUserMedia({
    audio: false,
    video: {
      facingMode: "user",
      width: WIDTH,
      height: HEIGHT,
    },
  });

  video.srcObject = stream;
  await video.play();

  var texture = new THREE.VideoTexture(video);
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.format = THREE.RGBFormat;

  var scene = new THREE.Scene();

  let camera = new THREE.OrthographicCamera(
    WIDTH / -2,
    WIDTH / 2,
    HEIGHT / 2,
    HEIGHT / -2,
    0.1,
    1000
  );

  //   let camera = new THREE.PerspectiveCamera(
  //     60,
  //     // window.innerWidth / window.innerHeight,
  //     640.0 / 480.0,
  //     1,
  //     1000
  //   );

  camera.position.z = WIDTH / 2.0;
  camera.zoom = 1.0;

  var geometry = new THREE.PlaneGeometry(WIDTH * 0.75, HEIGHT * 0.75);
  // var geometry = new THREE.Sphere(new THREE.Vector3(0.0,0.0,0.0), 240.0);
  var material = new THREE.MeshBasicMaterial({
    // color: 0xffff00,
    // side: THREE.DoubleSide,
    map: texture,
  });

  var shaderMaterial = new THREE.ShaderMaterial({
    vertexShader: vs,
    fragmentShader: shader,
    transparent: true,
    uniforms: {
      time: { value: 0.0 },
      opacity: { value: 0.8 },
      color: { value: new THREE.Vector3(1.0, 0.5, 0.0) },
      resolution: { value: new THREE.Vector2() },
      map: { value: texture },
      swtch: { value: 0 },
    },
  });

  // var plane = new THREE.Mesh(geometry, [material, shaderMaterial]);
  var plane = new THREE.Mesh(geometry, shaderMaterial);
  scene.add(plane);

  gl_div.appendChild(renderer.domElement);

  var renderPass = new RenderPass(scene, camera);
  effcomposer.addPass(renderPass);

  //   var sepiaShader = new ShaderPass(SepiaShader);
  //   var copy = new ShaderPass(CopyShader);
  //   copy.renderToScreen = true;

  //   effcomposer.addPass(renderPass);
  //   effcomposer.addPass(sepiaShader);
  //   effcomposer.addPass(copy);

  var glitchPass = new GlitchPass();
  glitchPass.renderToScreen = true;
  effcomposer.addPass(glitchPass);

  function animate() {
    // this.shaderMaterial.uniforms.opacity.value = 1;
    shaderMaterial.uniforms.time.value += 0.05;

    // renderer.render(scene, camera);
    effcomposer.render();
    requestAnimationFrame(animate);
  }
  requestAnimationFrame(animate);
});
