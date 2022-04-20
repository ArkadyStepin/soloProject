

const container = document.getElementById('container');
const canvas = document.getElementById('canvas1'); 
const file = document.getElementById('fileupload');

canvas.width = window.innerWidth; ран
canvas.height = window.innerHeight;
const ctx = canvas.getContext('2d');
let audioSource;
let analyser;

file.addEventListener('change', function(){
  const files = this.files;
  const audio1 = document.getElementById('audio1');
  audio1.src = URL.createObjectURL(files[0]); 
  audio1.load();
  audio1.play()
  const audioContext = new AudioContext();
  
  audioSource = audioContext.createMediaElementSource(audio1); 
  console.log(audio1);
  analyser = audioContext.createAnalyser(); 
  audioSource.connect(analyser);
  analyser.connect(audioContext.destination);
  analyser.fftSize = 2048;
  const bufferLength = analyser.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength); 
   
  const barWidth = (canvas.width/2.5)/bufferLength; 
  let barHeight; 
  let x;

  function animate(){ 
    x = 0;
    ctx.clearRect(0, 0, canvas.width, canvas.height); 
    analyser.getByteFrequencyData(dataArray);
    drawVisualiser(bufferLength, x, barWidth, barHeight, dataArray);
    requestAnimationFrame(animate);
  }
  animate();
});

function drawVisualiser(bufferLength, x, barWidth, barHeight, dataArray){
  for (let i = 0; i < bufferLength; i++){
    barHeight = dataArray[i] *2.5; 
    ctx.save(); // точка сохранения
    ctx.translate(canvas.width/2, canvas.height/2);
    ctx.rotate(i * Math.PI * 2.2 / bufferLength);

    // // =======Один вид покраса===================

    const red = i + barHeight/35;
    const green = barHeight/(i-25);
    const blue = barHeight + 50;
    ctx.fillRect(0, 0, barWidth, 20);
    ctx.fillStyle = 'rgb(' + red + ', ' + green + ', ' + blue + ')';
    
    // ===================Другой вид покраса(по ргб кругу)============
    
    // const hue = i * 3;
    // ctx.fillStyle = 'hsl(' + hue + ', 100%, 50%)';
    
    //=====================================
    
    ctx.fillRect(0, 0, barWidth, barHeight); 
    x += barWidth;
    ctx.restore();
  }
}
