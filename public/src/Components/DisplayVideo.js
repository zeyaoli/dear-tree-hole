import React, { useState, useRef, useEffect, useContext } from "react";
import SocketContext from "./SocketContext";

// Component
const DisplayVideo = () => {
  const socket = useContext(SocketContext);
  const [mediaUrl, setMediaUrl] = useState(null);
  const videoRef = useRef();
  const canvasRef = useRef();

  // canvas initialization
  const initCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    console.log(videoRef.current);

    const referenceWidth = 640;
    const referenceHeight = 480;
    const pixelScale = window.devicePixelRatio;

    //display size
    canvas.style.width = referenceWidth + "px";
    canvas.style.height = referenceHeight + "px";

    // Set actual device pixels
    canvas.width = referenceWidth * pixelScale;
    canvas.height = referenceHeight * pixelScale;

    let requestId;
    const render = () => {
      //display video on canvas
      ctx.drawImage(videoRef.current, 0, 0, 640, 480);
      requestId = requestAnimationFrame(render);
      //add video image manipulation
      ctx.filter = "blur(10px)";
      const imageData = ctx.getImageData(0, 0, 640, 480);
      // iterate over all pixels
      for (var i = 0, n = imageData.data.length; i < n; i += 4) {
        // Get existing pixel data
        var red = imageData.data[i];
        var green = imageData.data[i + 1];
        var blue = imageData.data[i + 2];
        var alpha = imageData.data[i + 3];

        // Set new pixel data
        imageData.data[i + 1] = red;
        imageData.data[i + 2] = red;
        imageData.data[i + 3] = 50;
      }
      ctx.putImageData(imageData, 0, 0);
    };

    render();
  };
  // twist the audio source from video
  const audioManipulation = () => {
    let context = new AudioContext();
    let audioSource = context.createMediaElementSource(videoRef.current);
    let filter = context.createBiquadFilter();
    var analyser = context.createAnalyser();
    let distortion = context.createWaveShaper();
    function makeDistortionCurve(amount) {
      var k = typeof amount === "number" ? amount : 50,
        n_samples = 44100,
        curve = new Float32Array(n_samples),
        deg = Math.PI / 180,
        i = 0,
        x;
      for (; i < n_samples; ++i) {
        x = (i * 2) / n_samples - 1;
        curve[i] = ((3 + k) * x * 20 * deg) / (Math.PI + k * Math.abs(x));
      }
      return curve;
    }

    distortion.curve = makeDistortionCurve(50);
    distortion.oversample = "2x";
    audioSource.connect(analyser);
    analyser.connect(distortion);
    distortion.connect(filter);
    filter.connect(context.destination);

    //config filter
    filter.type = "highshelf";
    filter.frequency.value = 2000;
    filter.gain.value = 10;
  };

  useEffect(() => {
    //receive previous person's video
    socket.on("videoFileArr", (arr) => {
      if (arr.length > 1) {
        setMediaUrl(arr[0]);
        initCanvas();
        audioManipulation();
        videoRef.current.onended = disposeVideo;
      } else {
        setMediaUrl(null);
      }
    });

    return () => {
      cancelAnimationFrame(requestId);
    };
  }, []);

  const disposeVideo = () => {
    console.log("send out dispose video");
    socket.emit("dispose", "disposed");
  };

  const playVideo = () => {
    videoRef.current.play();
  };

  return (
    <>
      {/* Detect if you are the first one to put the video or not! */}
      {mediaUrl == null ? (
        <p>Sorry no one sent a video before you</p>
      ) : (
        <>
          <canvas ref={canvasRef}></canvas>
          <video
            ref={videoRef}
            src={mediaUrl}
            type='video/webm'
            controls
            style={{ display: "none" }}
          />
          <button onClick={playVideo}>Play</button>
        </>
      )}
    </>
  );
};

export default DisplayVideo;
