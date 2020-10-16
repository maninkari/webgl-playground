const btn = document.createElement("button")
btn.innerHTML = "Start"
btn.id = "btnStart"
document.body.appendChild(btn)

const video = document.createElement("video")
document.body.appendChild(video)

const canvas = document.createElement("canvas")
document.body.appendChild(canvas)

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
})





