const container = document.getElementById("container");
const canvas = document.getElementById("canvas1");
const file = document.getElementById("fileupload");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const ctx = canvas.getContext("2d");
let audioSource;
let analyser;
let audioContext;
let captureStream;
async function startCapture() {
  const displayMediaOptions = {
    video: {
      cursor: "always",
    },
    audio: {
      echoCancellation: true,
      noiseSuppression: true,
      sampleRate: 44100,
    },
  };
  audioContext = new AudioContext();
  console.log(audioContext);
  // if (audioContext) return;
  captureStream = await navigator.mediaDevices.getDisplayMedia(
    displayMediaOptions
  );

  console.log(captureStream.getAudioTracks());

  analyser = audioContext.createAnalyser();
  try {
    audioSource = audioContext.createMediaStreamSource(captureStream);
  } catch (error) {
    console.log(error.message);
  }
  await audioSource.connect(analyser);
  analyser.connect(audioContext.destination);
  analyser.fftSize = 2048;
  const bufferLength = analyser.frequencyBinCount;те
  const dataArray = new Uint8Array(bufferLength);

  const barWidth = canvas.width / 2.5 / bufferLength; 
  let barHeight;
  let x;

  function animate() {
    x = 0;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    analyser.getByteFrequencyData(dataArray);
    drawVisualiser(bufferLength, x, barWidth, barHeight, dataArray);
    requestAnimationFrame(animate);
  }
  animate();
}

file.addEventListener("click", startCapture);

function drawVisualiser(bufferLength, x, barWidth, barHeight, dataArray) {
  for (let i = 0; i < bufferLength; i++) {
    barHeight = dataArray[i] * 2.5;
    ctx.save(); // точка сохранения
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate((i * Math.PI * 2.2) / bufferLength);

    // // =======Один вид покраса===================

    const red = i + barHeight / 35;
    const green = barHeight / (i - 25);
    const blue = barHeight + 50;
    ctx.fillRect(0, 0, barWidth, 20);
    ctx.fillStyle = "rgb(" + red + ", " + green + ", " + blue + ")";
    ctx.fillRect(0, 0, barWidth, barHeight);
    x += barWidth;
    ctx.restore();
  }
}
