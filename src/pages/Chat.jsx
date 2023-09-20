/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { Header } from "../components/Home/Header";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ScaleLoader } from "react-spinners";
import { useEffect, useState } from "react";
import { auth } from "../config/firebase";
import { getAuth } from "firebase/auth";

const orgKey = import.meta.env.VITE_ORG;
const openaiKey = import.meta.env.VITE_OPENAI;
const elevenKey = import.meta.env.VITE_ELEVEN;
const voiceKey = import.meta.env.VITE_VOICE;

export const Chat = () => {
  const nav = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
        nav("/chat");
      } else {
        setUser(null);
        nav("/sign-in");
      }
    });
    return () => unsubscribe();
  }, []);

  //add state for input and chat log
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);

  // Define a state variable to hold the audio URL
  const [audioURL, setAudioURL] = useState(null);

  const prompt = document.querySelector("input");
  // const btn = document.getElementsByClassName("clk");
  const btn = document.getElementById("clk");

  function disablePrompt() {
    prompt.disabled = true;
    btn.disabled = true;
  }

  function enablePrompt() {
    prompt.disabled = false;
    btn.disabled = false;
  }
  // const [messages, setMessages] = useState([
  //   {
  //     sender: "gpt",
  //     message: "Hello, I am SpotifAI, How can I assist you today ? ",
  //   },
  // ]);

  const [messages, setMessages] = useState([]);

  // function clearChat() {
  //   setMessages([]);
  // }
  // function clearAudio() {
  //   setMessages([]);
  // }

  const handleSubmit = async (e) => {
    e.preventDefault();
    disablePrompt();
    setAudioURL(null);

    // add client message
    const newMessage = {
      sender: "user",
      message: `${input}`,
      direction: "outgoing",
    };

    // post all the old Messages & new Message
    const newMessages = [...messages, newMessage];
    // update our messages state
    setMessages(newMessages);

    // process message to chatgpt: send it over and see the response
    await sendMessage(newMessages);

    setLoading(false);
  };

  async function sendMessage(chatMessages) {
    let apiMessages = chatMessages.map((messageObject) => {
      let role = "";
      if (messageObject.sender === "gpt") {
        // response from chatGPT
        role = "assistant";
      } else {
        // request from user
        role = "user";
      }
      return { role: role, content: messageObject.message };
    });

    const systemMessage = {
      // define how chatgpt talks in initial message
      role: "system",
      // content: "You are an AI Assistant chatbot of SpotifAI a website that help users generate their favorite podcasts.",
      content: `You are a professional writer specializing in writing podcast scripts.
        I will tell you what is the subject that I want and you will give me an entertaining script to use.
        You will make sure there are no placeholders or fields to replace.
        You can imagine the hosts's name and other personal information.
        You will have to stick to the subject of the podcast.
        Don't put any indicators for music (for example [Upbeat music] or [Opening Music] or [Closing Music])
        Give me just the actual script of the podcast.
        The podcast will have only one person who talks.
        Don't specify the person who is talking the script (for example [Host] or [Guest] or [Speaker])
        I will tell you the number of words I want in the script.
        I will also tell you what is the gender of the speaker in the podcast.
        Do not specify any music or sound effects or laughs or coughs or any sound-related detail.
        And Do Not mention that the speaker is talking like this: "Speaker:" or "Host:"
        All the details will be included in my prompt.
        I want the script to be no long than 50 characters long and the reader of the script is female and Answer as short and concise as possible`,
    };

    // Rates considered for words per minute and words per token
    // const wpm_rate = 150
    // const wpt_rate = 0.75

    // Calculate words and tokens and assert they're integers
    // const words = 10 * wpm_rate
    // const tokens = words / wpt_rate

    const apiRequestBody = {
      model: "gpt-3.5-turbo",
      messages: [systemMessage, ...apiMessages],
      // messages: [ ...apiMessages],
      // max_tokens: 100,
      // max_tokens: tokens,
    };
    let response = "";

    // fetch response to the api combining the cat log array of messages and sending it as a message to openai api as a post
    await fetch("https://api.openai.com/v1/chat/completions", {
      // await fetch("https://spotif-ai.onrender.com/generate", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + openaiKey,
        "OpenAI-Organization": orgKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(apiRequestBody),
    })
      .then((data) => {
        return data.json();
      })
      .then((data) => {
        response = data.choices[0].message.content;
        // response = data;
        setMessages([
          ...chatMessages,
          {
            sender: "gpt",
            message: response,
          },
        ]);
        handleAudioFetch(response);
        // console.log(response);
      })
      .catch((err) => {
        console.log(err);
        // response = err.message;
      });
    setInput("");
    // setAudioURL("hello.wav");

    // enablePrompt();
  }

  // Define a function called textToSpeech that takes in a string called inputText as its argument.
  const textToSpeech = async (inputText) => {
    // Set the API key for ElevenLabs API.
    // Do not use directly. Use environment variables.
    // const API_KEY = elevenKey;
    // Set the ID of the voice to be used.
    // const VOICE_ID = voiceKey;

    // Set options for the API request.
    const options = {
      method: "POST",
      url: `https://api.elevenlabs.io/v1/text-to-speech/${voiceKey}/stream`,
      // url: `https://api.elevenlabs.io/v1/text-to-speech/${voiceKey}`,
      headers: {
        accept: "audio/mpeg", // Set the expected response type to audio/mpeg.
        // accept: "audio/wav", // Set the expected response type to audio/mpeg.
        "content-type": "application/json", // Set the content type to application/json.
        "xi-api-key": `${elevenKey}`, // Set the API key in the headers.
      },
      data: {
        text: inputText, // Pass in the inputText as the text to be converted to speech.
      },
      // responseType: "stream",
      responseType: "arraybuffer", // Set the responseType to arraybuffer to receive binary data as response.
    };

    // Send the API request using Axios and wait for the response.
    const speechDetails = await axios.request(options);

    // Return the binary audio data received from the API response.
    return speechDetails.data;
  };

  // Define a function to fetch the audio data and set the URL state variable
  const handleAudioFetch = async (text) => {
    // Call the textToSpeech function to generate the audio data for the text "Hello welcome"
    // const data = await textToSpeech("Hello welcome");
    const data = await textToSpeech(text);
    // Create a new Blob object from the audio data with MIME type 'audio/mpeg'
    const blob = new Blob([data], { type: "audio/mpeg" });
    // Create a URL for the blob object
    const url = URL.createObjectURL(blob);
    // Set the audio URL state variable to the newly created URL
    setAudioURL(url);

    enablePrompt();
  };

  // let toggle = (button) => {
  //   let element = document.getElementById("myaudio");
  //   let hidden = element.getAttribute("hidden");

  //   if (hidden) {
  //     element.removeAttribute("hidden");
  //     button.innerText = "Hide Audio";
  //   } else {
  //     element.setAttribute("hidden", "hidden");
  //     button.innerText = "Show Audio";
  //   }
  // };
  const [audioOpen, setAudioOpen] = useState(false);
  // const [buttonShow, setButtonShow] = useState("Show Audio");

  return (
    <>
      <Header />
      {/* <div className="Chat flex-box flex-col"> */}
      <div className="flex flex-col relative">
        <div className="chatbox min-h-[70vh] max-h-[70vh]">
          <div className="chat-log h-full">
            {loading ? (
              <div className="flex-box flex-col">
                <div className="flex-box mt-40">
                  <div className="flex-box">
                    <img src="micro.svg" alt="micro" className="w-1/3 h-1/3" />
                  </div>
                </div>
                <div className="space-x-1 flex-box flex-col md:flex-row text-center">
                  <span className="text-neutral-50 text-[22px] font-bold">
                    Let’s{" "}
                  </span>
                  <span className="text-purple-950 text-[22px] font-bold ">
                    generate
                  </span>
                  <span className="text-neutral-50 text-[22px] font-bold">
                    {" "}
                    some magic start now.
                  </span>
                </div>
              </div>
            ) : (
              <>
                {messages.map((message, i) => (
                  <ChatMessage key={i} messages={message} />
                ))}

                {audioURL ? (
                  <div className="w-full flex-box flex-col py-5">
                    {audioOpen && (
                      <>
                        <audio
                          autoPlay
                          controls
                          src={audioURL}
                          className="audio-player"
                          type="audio/mpeg"
                        >
                          {/* <source src={audioURL} type="audio/mpeg" /> */}
                        </audio>
                      </>
                    )}

                    <div className="flex-box space-x-14 py-10">
                      <button
                        // onClick={toggle(this)}
                        onClick={() => {
                          setAudioOpen((open) => !open);
                          // setButtonShow("Hide Audio");
                        }}
                        className="border rounded-lg text-slate-200 bg-info hover:text-[#11001C] hover:bg-success p-2 text-lg border-slate-300"
                      >
                        {audioOpen ? (
                          <span>Hide Audio</span>
                        ) : (
                          <span>Show Audio</span>
                        )}
                        {/* <span>{buttonShow}</span> */}
                      </button>
                      <a
                        href={audioURL}
                        download="spotifAI_podcast.wav"
                        className="border rounded-lg text-slate-200 bg-info hover:text-[#11001C] hover:bg-success p-2 text-lg border-slate-300"
                      >
                        Download
                      </a>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center py-10">
                    <div>
                      <ScaleLoader color="#36d7b7" />
                    </div>
                    <div>
                      <p className="text-md font-medium text-slate-100 pt-8">
                        SpotifAI is generating...
                      </p>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        <div className="chat-input-holder flex-box px-3">
          <form onSubmit={handleSubmit} className="flex-box flex-[0.8] w-full">
            <input
              rows="1"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your idea"
              className="text-white text-base font-normal flex-box flex pl-6 flex-[0.8] py-5 bg-neutral-700 bg-opacity-20 rounded-[50px] border border-zinc-400 border-opacity-60 backdrop-blur-[60px] justify-start items-center gap-2 w-full md:h-20"
            />
            <button
              id="clk"
              className="clk px-2 py-5 md:h-20 rounded-full flex-[0.2] flex-box hover:bg-secondary cursor-pointer btn-primary capitalize btn-block lg:btn-wide font-neov "
              onClick={handleSubmit}
            >
              <img className="h-5 w-5 clk" src="/stars.png" alt="stars" />
              <p className="text-base px-2 hidden md:block font-bold clk">
                Generate
              </p>
            </button>
          </form>
        </div>
      </div>
    </>
  );
};
const ChatMessage = ({ messages }) => {
  const [photo, setPhoto] = useState("");
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        const usr = getAuth();
        const aut = usr.currentUser;
        // const photo = aut.photoURL;
        setPhoto(aut.photoURL);
      } else {
        setPhoto("user.png");
      }
    });
    return () => unsubscribe();
  }, []);
  return (
    <div
      className={`chat-message justify-top ${
        messages.sender === "gpt" && "chatgpt"
      }`}
    >
      <div className="chat-message-center">
        <div className={`avatar  ${messages.sender === "gpt" && "chatgpt"}`}>
          {messages.sender === "gpt" ? (
            <img className="" src="logo.svg" alt="gpt" />
          ) : (
            <>
              <img className="img flex-end" src={photo} alt="user" />
            </>
          )}
        </div>

        <div className="message">{messages.message}</div>
      </div>
    </div>
  );
};
