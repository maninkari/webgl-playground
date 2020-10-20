import vs from "./pos.vert";
import shader from "./shader.frag";

const btn = document.createElement("button");
btn.innerHTML = "Start";
btn.id = "btnStart";
btn.style = "float: right;";
document.body.appendChild(btn);

const video = document.createElement("video");
video.style = "float:left;";
document.body.appendChild(video);

const canvas = document.createElement("canvas");
canvas.width = 620;
canvas.height = 480;
const ctx = canvas.getContext("webgl");
document.body.appendChild(canvas);

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

  initShaders(ctx, vs, shader);
  var n = initVertexBuffers(ctx);
  if (n < 0) {
    console.log("Failed to set the positions of the vertices");
    return;
  }

  // Clear canvas
  ctx.clearColor(0.0, 0.0, 0.0, 1.0);
  ctx.clear(ctx.COLOR_BUFFER_BIT);

  // Draw
  ctx.drawArrays(ctx.TRIANGLES, 0, n);
});

function initVertexBuffers(gl) {
  // Vertices
  var dim = 2;
  var vertices = new Float32Array([
    -0.5,
    0.5,
    0.5,
    0.5,
    0.5,
    -0.5, // Triangle 1
    -0.5,
    0.5,
    0.5,
    -0.5,
    -0.5,
    -0.5, // Triangle 2
  ]);

  // Fragment color
  var rgba = [0.0, 0.0, 1.0, 1.0];

  // Create a buffer object
  var vertexBuffer = gl.createBuffer();
  if (!vertexBuffer) {
    console.log("Failed to create the buffer object");
    return -1;
  }
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

  // Assign the vertices in buffer object to a_Position variable
  var a_Position = gl.getAttribLocation(gl.program, "a_Position");
  if (a_Position < 0) {
    console.log("Failed to get the storage location of a_Position");
    return -1;
  }
  gl.vertexAttribPointer(a_Position, dim, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(a_Position);

  // Assign the color to u_FragColor variable
  var u_FragColor = gl.getUniformLocation(gl.program, "u_FragColor");
  if (u_FragColor < 0) {
    console.log("Failed to get the storage location of u_FragColor");
    return -1;
  }
  gl.uniform4fv(u_FragColor, rgba);

  // Return number of vertices
  return vertices.length / dim;
}

function initShaders(gl, vs_source, fs_source) {
  console.log("initShaders");
  // Compile shaders
  var vertexShader = makeShader(gl, vs, gl.VERTEX_SHADER);
  var fragmentShader = makeShader(gl, shader, gl.FRAGMENT_SHADER);

  // Create program
  var glProgram = gl.createProgram();

  // Attach and link shaders to the program
  gl.attachShader(glProgram, vertexShader);
  gl.attachShader(glProgram, fragmentShader);
  gl.linkProgram(glProgram);
  if (!gl.getProgramParameter(glProgram, gl.LINK_STATUS)) {
    alert("Unable to initialize the shader program");
    return false;
  }

  // Use program
  gl.useProgram(glProgram);
  gl.program = glProgram;

  return true;
}

function makeShader(gl, src, type) {
  var shader = gl.createShader(type);
  gl.shaderSource(shader, src);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    alert("Error compiling shader: " + gl.getShaderInfoLog(shader));
    return;
  }
  return shader;
}
