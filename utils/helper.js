const visualize = async () => {
  const canvas = document.querySelector('.visualizer');
  let audioCtx;
  const canvasCtx = canvas.getContext("2d");
  if (!audioCtx) {
    audioCtx = new AudioContext();
  }
  let camera_stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
  const source = audioCtx.createMediaStreamSource(camera_stream);

  const analyser = audioCtx.createAnalyser();
  analyser.fftSize = 2048;
  const bufferLength = analyser.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);

  source.connect(analyser);
  //analyser.connect(audioCtx.destination);

  draw()

  function draw() {
    const WIDTH = canvas.width
    const HEIGHT = canvas.height;

    requestAnimationFrame(draw);

    analyser.getByteTimeDomainData(dataArray);

    canvasCtx.fillStyle = 'rgb(200, 200, 200)';
    canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);

    canvasCtx.lineWidth = 2;
    canvasCtx.strokeStyle = 'rgb(0, 0, 0)';

    canvasCtx.beginPath();

    let sliceWidth = WIDTH * 1.0 / bufferLength;
    let x = 0;


    for (let i = 0; i < bufferLength; i++) {

      let v = dataArray[i] / 128.0;
      let y = v * HEIGHT / 2;

      if (i === 0) {
        canvasCtx.moveTo(x, y);
      } else {
        canvasCtx.lineTo(x, y);
      }

      x += sliceWidth;
    }

    canvasCtx.lineTo(canvas.width, canvas.height / 2);
    canvasCtx.stroke();

  }

}
function createVideoClip(videoURL) {

  let videoClips = document.querySelector('.video-clip');
  var videoTag = document.createElement("VIDEO");
  var aTag = document.createElement('a');
  var text = document.createTextNode("DownloadLink");

  videoTag.setAttribute("src", videoURL);
  videoTag.setAttribute("width", "320");
  videoTag.setAttribute("height", "240");
  videoTag.setAttribute("controls", "controls");
  videoClips.appendChild(videoTag);

  aTag.href = videoURL;
  aTag.download = true;
  aTag.style.textAlign = "center";
  aTag.style.fontSize = "25px";
  aTag.appendChild(text);
  videoClips.appendChild(aTag);


}


export { visualize, createVideoClip }

