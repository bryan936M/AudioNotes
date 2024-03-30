/* eslint-disable no-unused-vars */
import { useRef, useState, useEffect } from "react";
import { saveAs } from "file-saver";
import Transcriber from "./components/Transcriber";

export default function App() {
  const [recording, setRecording] = useState("");
  const [recordings, setRecordings] = useState([]);

  const recognitionRef = useRef(null);

  const Download = () => {
    if (!recording) {
      alert("No recording to download");
      return;
    }
    const name = prompt("Enter a name for your recording...");
    if (!name) {
      alert("Your recording was not saved...");
      return;
    }
    const blob = new Blob([recording], { type: "text/plain;charset=utf-8" });

    saveAs(blob, `${name}.txt`);
  };

  // close the recognition when the component unmounts
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
        alert("Recording stopped using cleanup function");
      }
    };
  }, []);

  const handleRecord = async (e) => {
    e.preventDefault();

    recognitionRef.current = new window.webkitSpeechRecognition();
    recognitionRef.current.lang = "fr-FR";
    recognitionRef.current.continuous = true;
    recognitionRef.current.interimResults = true;

    recognitionRef.current.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map((result) => result[0])
        .map((result) => result.transcript)
        .join("");

      setRecording([...recording, transcript]);
    };

    recognitionRef.current.start();

    // e.preventDefault();
    // const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    // const mediaRecorder = new MediaRecorder(stream);
    // const audioChunks = [];

    // mediaRecorder.addEventListener("dataavailable", (event) => {
    //   audioChunks.push(event.data);
    // });

    // mediaRecorder.addEventListener("stop", () => {
    //   const audioBlob = new Blob(audioChunks);
    //   const audioUrl = URL.createObjectURL(audioBlob);
    //   setRecording(audioUrl);
    // });

    // mediaRecorder.start();
    // setTimeout(() => {
    //   mediaRecorder.stop();
    // }, 3000);
  };

  const handleStopRecord = (e) => {
    e.preventDefault();
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setRecordings([...recordings, recording]);
      setRecording("");
      Download();
    }
  };

  return (
    <div className="w-10/12 lg:w-1/4 m-auto mt-32 flex flex-col gap-6">
      <h1 className="text-3xl font-bold underline">Record voice</h1>
      <p className="text-lg">Click the button to record your voice</p>

      <div className="w-full flex flex-col lg:flex-row gap-2 justify-around">
        <button
          onClick={handleRecord}
          className="p-5 w-full text-white bg-red-800 rounded-lg"
        >
          Record
        </button>

        <button
          onClick={handleStopRecord}
          className="p-5 w-full text-white bg-blue-800 rounded-lg"
        >
          Stop
        </button>
      </div>

      <h2 className="text-3xl font-bold underline">Recordings</h2>
      <p className="p-3 text-gray-700">{recording}</p>

      {recordings[0] ? (
        <ul>
          {recordings.map((record, index) => (
            <li key={index}>* {record}</li>
          ))}
        </ul>
      ) : (
        <p className="text-lg">Your recordings will appear here {recording}</p>
      )}


      <Transcriber />
    </div>
  );
}
