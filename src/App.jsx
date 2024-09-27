import { useEffect, useState } from 'react';
import './App.css';
import axios from 'axios';

function App() {
  let apikey = import.meta.env.VITE_SOME_GEMINI_API;

  const [showData, setShowData] = useState("");
  const [ques, setQeus] = useState("");
  const [sound, setSound] = useState(false); // Track sound state
  const [isListening, setIsListening] = useState(false); // Track if the microphone is active

  // SpeechRecognition API for speech-to-text
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognition();

  // Configure SpeechRecognition settings
  recognition.continuous = true; // Keeps listening after detecting speech
  recognition.interimResults = false; // Return final results, not partial
  recognition.lang = 'en-US'; // Set language for speech recognition

  // Function to start listening to user input
  const startListening = () => {
    setIsListening(true);
    recognition.start();
  };

  // Function to stop listening
  const stopListening = () => {
    setIsListening(false);
    recognition.stop();
  };

  // When speech is recognized, update the query (ques) state
  recognition.onresult = (event) => {
    const transcript = event.results[event.resultIndex][0].transcript.trim();
    setQeus(transcript); // Update ques with recognized text
  };

  function speak(text) {
    const utterance = new SpeechSynthesisUtterance(text);
    speechSynthesis.speak(utterance);
  }

  function stopSpeak() {
    speechSynthesis.cancel();
  }

  async function getData() {
    setShowData("loading..");
    const res = await axios({
      url: apikey,
      method: "post",
      data: {
        contents: [{ parts: [{ text: ques }] }],
      },
    });
    setShowData(res['data']['candidates'][0]['content']['parts'][0]['text']);
  }

  function speakHandler() {
    speak(showData);
  }

  function toggleSound() {
    if (sound === false) {
      speakHandler();
    } else {
      stopSpeak();
    }
    setSound(!sound); // Toggle the sound state
  }

  return (
    <div className='bg-gray-900 w-full h-screen flex justify-center items-center flex-row'>
      <div className='w-5/6 h-5/6 flex justify-between rounded-lg overflow-hidden'>
        <textarea
          name=""
          id=""
          cols="80"
          rows="15"
          value={showData}
          readOnly
          className='rounded-lg font-mono bg-white outline-none border-[4px] border-black'
        ></textarea>
        <div className='w-[40%] flex flex-col items-center bg-gray-900 rounded-lg'>
          <h1 className='uppercase text-white text-[4rem] font-serif mt-20 font-bold'>ChatBot</h1>
          <textarea
            value={ques}
            onChange={(e) => setQeus(e.target.value)}
            placeholder='Ask your query '
            name=""
            id=""
            cols="45"
            rows="2"
            className='font-serif bg-slate-100 outline-none rounded-lg border-gray-700 mt-32'
          ></textarea>

          <div className='bg-white w-14 h-14 rounded-full flex justify-center items-center mt-6 shadow-2xl absolute right-10 bottom-[33%]'>
            <button className='text-5xl font-mono text-black' onClick={getData}>^</button>
          </div>

          {/* Button to start/stop voice input */}
          <div className='bg-white w-14 h-14 rounded-full flex justify-center items-center mt-6 shadow-2xl absolute left-4 bottom-4'>
            <button
              className={`text-2xl ${isListening ? 'text-red-600' : 'text-black'}`} 
              onClick={isListening ? stopListening : startListening}>
              {isListening ? '🎤'  : '🔇'}
            </button>
          </div>
        </div>

        <div className='bg-white w-20 h-20 top-[22%] right-[3%] rounded-full absolute z-10 flex justify-center items-center rotate-180'>
          <button
            className='text-3xl cursor-pointer'
            onClick={toggleSound}
          >
            {sound ? '🔊' : '🔇'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
