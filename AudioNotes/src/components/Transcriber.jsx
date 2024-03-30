/* eslint-disable no-unused-vars */
import React, { useEffect, useRef, useState } from "react";
import axios from "axios";

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
const model = "whisper-1";

function Transcriber() {
  const inputRef = useRef(null);
  const [file, setFile] = useState();
  const [transcription, setTranscription] = useState("");

  const handleTranscription = () => {
    setFile(inputRef.current.files[0]);
    console.log(inputRef.current.files[0]);
  };

  const transcribe = async () => {
    if (!file) {
      alert("Please select an audio file to transcribe");
      return;
    }
    const formData = new FormData();
    formData.append("file", file);
    formData.append("model", model);

    console.log("transcribing..");
    axios
      .post("https://api.openai.com/v1/audio/transcriptions	", formData, {
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        console.log(response.data.text);
        setTranscription(response.data.text);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <div className="w-full">
      <div className="h-1 w-full bg-slate-200 mb-7" />
      <div className="flex flex-col gap-5 w-full">
        <h1 className="text-3xl font-bold underline">Transcribe Audio</h1>
        <p className="text-lg">Click the button to transcribe your audio</p>

        <input
          type="file"
          ref={inputRef}
          onChange={handleTranscription}
          name="audio"
          id="audio"
        />

        <button
          onClick={transcribe}
          className="p-5 lg:w-fit text-white bg-red-800 rounded-lg"
        >
          Transcribe
        </button>

        <h1 className="text-3xl font-bold underline">Transcriptions</h1>
        <p className="p-3 text-gray-700">Transcription will appear here...</p>

        <p className="mb-5">{transcription}</p>
      </div>
    </div>
  );
}

export default Transcriber;
