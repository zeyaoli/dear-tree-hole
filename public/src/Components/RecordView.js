//ref: https://github.com/0x006F/react-media-recorder/blob/master/src/index.ts#L218
//ref: https://github.com/wmik/use-media-recorder/blob/master/index.js
import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useContext,
} from "react";
import regeneratorRuntime from "regenerator-runtime";
import SocketContext from "./SocketContext";
import "../Styles/record.css";

const RecordView = ({
  audio = true,
  video = false,
  onStop = () => null,
  mediaStreamConstraints = {},
  changeRecordState,
}) => {
  // init states ref and context
  const mediaRecorder = useRef(null);
  const mediaChunks = useRef([]);
  const mediaStream = useRef(null);
  const blobToSubmit = useRef(null);
  const [status, setStatus] = useState("idle");
  const [mediaBlobUrl, setMediaBlobUrl] = useState(null);
  const [error, setError] = useState(null);
  const socket = useContext(SocketContext);
  const recordTimeout = useRef(null);
  const recTimeLimit = 11000;

  const getMediaStream = useCallback(async () => {
    if (error) {
      setError(null);
    }
    setStatus("acquiring media");
    try {
      //reference: https://github.com/wmik/use-media-recorder/blob/master/index.js
      let stream;
      stream = await window.navigator.mediaDevices.getUserMedia({
        video: video || true,
        audio: audio || true,
      });
      if (mediaStreamConstraints.audio) {
        let audioStream = await window.navigator.mediaDevices.getUserMedia({
          audio: mediaStreamConstraints.audio,
        });

        audioStream
          .getAudioTracks()
          .forEach((audioTrack) => stream.addTrack(audioTrack));
      }

      mediaStream.current = stream;
      setStatus("🌳 i'm ready. speak out your feeling anytime 🌳");
    } catch (err) {
      setError(err);
      setStatus("failed to record :( ");
    }
  }, [audio, video]);

  const clearMediaStream = () => {
    if (mediaStream.current) {
      mediaStream.current.getTracks().forEach((track) => track.stop());
      mediaStream.current = null;
    }
  };

  useEffect(() => {
    if (!window.MediaRecorder) {
      throw new ReferenceError(
        "MediaRecorder is not supported in this browser. Please ensure that you are running the latest version of chrome/firefox/edge."
      );
    }

    const checkConstraints = (mediaType) => {
      const supportedMediaConstraints = navigator.mediaDevices.getSupportedConstraints();
      const unSupportedConstraints = Object.keys(mediaType).filter(
        (constraint) => !supportedMediaConstraints[constraint]
      );

      if (unSupportedConstraints.length > 0) {
        console.error(
          `The constraints ${unSupportedConstraints.join(
            ","
          )} doesn't support on this browser. Please check your ReactMediaRecorder component.`
        );
      }
    };

    if (typeof audio === "object") {
      checkConstraints(audio);
    }
    if (typeof video === "object") {
      checkConstraints(video);
    }

    if (!mediaStream.current) {
      getMediaStream();
    }
  }, [audio, video, getMediaStream, mediaStreamConstraints]);

  const startRecording = async () => {
    if (error) {
      setError(null);
    }
    if (!mediaStream.current) {
      await getMediaStream();
    }
    mediaChunks.current = [];
    if (mediaStream.current) {
      mediaRecorder.current = new MediaRecorder(mediaStream.current);
      mediaRecorder.current.addEventListener(
        "dataavailable",
        onRecordingActive
      );
      mediaRecorder.current.onstop = onRecordingStop;
      mediaRecorder.current.start();
      console.log("start");
      setStatus("💓 i'm hearing you speaking, you can stop sharing anytime 💓");
      recordTimeout.current = setTimeout(() => {
        mediaRecorder.current.stop();
        console.log("stop");
        setStatus("Recording Stopped");
        clearMediaStream();
        mediaRecorder.current = null;
      }, recTimeLimit);
    }
  };

  const onRecordingActive = (e) => {
    if (e.data.size) {
      mediaChunks.current.push(e.data);
    }
    // console.log(mediaChunks.current);
  };

  const stopRecording = () => {
    if (mediaRecorder.current) {
      if (mediaRecorder.current.state != "inactive") {
        mediaRecorder.current.stop();
        console.log("stop");
        setStatus("Recording Stopped");
        clearMediaStream();
        mediaRecorder.current = null;
        clearTimeout(recordTimeout.current);
      }
    }
  };

  const onRecordingStop = () => {
    clearTimeout(recordTimeout.current);
    const [chunks] = mediaChunks.current;
    const blob = new Blob(mediaChunks.current, { type: "video/webm" });
    const url = URL.createObjectURL(blob);
    setMediaBlobUrl(url);
    onStop(url, blob);
    blobToSubmit.current = blob;
    // console.log(blob);
  };

  const onSubmit = () => {
    if (blobToSubmit.current) {
      console.log(blobToSubmit.current);
      // web socket
      socket.emit("video", blobToSubmit.current);
      changeRecordState();
    }
  };

  return (
    <>
      <p>{status}</p>
      <div id='buttons'>
        <button onClick={startRecording}>Start talking</button>
        <button onClick={stopRecording}>I'm done sharing</button>
      </div>

      {mediaBlobUrl !== null && (
        <div id='preview'>
          <video src={mediaBlobUrl} controls />
          <button onClick={onSubmit}>Send out your feeling</button>
        </div>
      )}
    </>
  );
};

export default RecordView;
