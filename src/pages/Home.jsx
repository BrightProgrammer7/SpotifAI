import { useNavigate } from "react-router-dom";
import { Header } from "../components/Home/Header";
import { useEffect, useState } from "react";
import { auth } from "../config/firebase";

export const Home = () => {
  const nav = useNavigate();
  const [user, setUser] = useState(null);
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <>
      <Header />
      <div className="hero items-start bg-base-100 flex-box flex-col pt-4 w-full h-[calc(100dvh - 4rem)]">
        <div className="flex flex-col justify-center lg:flex-row-reverse items-center lg:justify-between px-6 lg:px-16 z-[1]">
          <img
            src="header.svg"
            className=" lg:max-w-xl mr-8 lg:mr-0 select-none max-w-xs"
            alt="header-bg"
            height={600}
            width={600}
            draggable={false}
          />
          <div>
            <div className="md:w-20 h-[33px] px-5 py-1 bg-pink-950 rounded-full justify-center items-center gap-0.5 inline-flex">
              <div className="w-5 h-5 relative">
                <img width={100} height={100} src="stars.png" alt="stars" />
              </div>
              <div className="text-white text-base font-normal">Ai</div>
            </div>
            <h1 className="flex flex-col">
              <span className="text-white text-3xl lg:text-6xl font-bold lg:leading-snug leading-tight">
                Generate any{" "}
                <span className="text-purple-950 text-3xl lg:text-6xl font-bold lg:leading-snug leading-tight">
                  podcast
                </span>
              </span>
              <span className="text-white text-3xl lg:text-6xl font-bold lg:leading-snug leading-tight">
                idea in your mind in one click
              </span>
            </h1>

            <p className="py-6 font-neov">
              Make your podcast passion come to reality just type your idea in
              prompt and our website made the magic by generate a podcast
              suitable to your idea with text and sound format. Don't wait try
              it Now.
            </p>
            {!user ? (
              <button
                className="btn btn-primary rounded-full capitalize btn-block lg:btn-wide font-neov "
                onClick={() => nav("/sign-in")}
              >
                Generate Now
              </button>
            ) : (
              <div onClick={() => nav("/chat")}>
                <button className="btn btn-primary rounded-full capitalize btn-block lg:btn-wide font-neov ">
                  Generate Now
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="w-full">
          <img
            src="effect.svg"
            className="w-full absolute -bottom-44 -z-0 select-none hidden lg:block"
            alt="effect"
            height={100}
            width={800}
            draggable={false}
          />
        </div>
      </div>

      <div className="flex flex-col w-full justify-center items-center lg:px-24 lg:pb-20 px-6 pb-6">
        <div className="flex-box flex-col md:flex-row lg:pb-32 lg:pt-72 pb-16 pt-16">
          <div>
            <img
              src="heart-face.svg"
              className="max-w-lg lg:max-w-lg"
              alt="heart face"
              width="305"
              height="293"
            />
          </div>
          <div className=" lg:w-[70%]">
            <h3 className="text-3xl font-medium lg:text-5xl my-5">
              What is <span>SpotifAI?</span>
            </h3>
            <p className="">
              SpotifAI is an AI platform that helps you create podcasts. Just
              give it an idea, and it will generate a podcast script for you in
              text format You can then use the script to create an audio
              podcast.SpotifAI is free to use for basic features, and there are
              paid plans available for businesses and teams. Here are some of
              the benefits of using SpotifAI to create podcasts: Save
              time,Improve quality,Get feedback and Collaborate with others
            </p>
          </div>
        </div>
        {/* second */}
        <div className="flex-box flex-col-reverse lg:flex-row w-full mb-16">
          <div className="lg:w-[70%]">
            <h3 className="text-3xl font-medium lg:text-5xl my-5">
              Can experts use SpotifAI?
            </h3>
            <p className="mb-6 text-lg">
              SpotifAI has the potential to revolutionize the podcast field. By
              making it easier and faster to create high-quality podcasts,
              SpotifAI can help more people start and grow their podcast
              businesses.Experts in the podcast field can use SpotifAI to reach
              another level by:
            </p>
            <ul className="list-inside flex-col">
              <li className="flex items-start gap-2 mb-3">
                <img
                  src="green-star.png"
                  className="max-w-lg lg:max-w-lg"
                  alt="heart face"
                />
                Creating more content: SpotifAI can help experts create more
                content by automating the scriptwriting process. This frees up
                experts' time so they can focus on other aspects of their
                podcast business, such as promoting and distributing their
                content.
              </li>
              <li className="flex items-start gap-2 mb-3">
                <img
                  src="yellow-star.png"
                  className="max-w-lg lg:max-w-lg"
                  alt="heart face"
                />
                Improving the quality of their content: SpotifAI can help
                experts improve the quality of their content by generating
                scripts that are both creative and engaging. This can help
                experts attract more listeners and build a loyal audience.
              </li>
              <li className="flex items-start gap-2">
                <img
                  src="pink-star.png"
                  className="max-w-lg lg:max-w-lg"
                  alt="heart face"
                />
                Experimenting with new formats: SpotifAI can help experts
                experiment with new podcast formats, such as interview shows,
                narrative podcasts, and comedy podcasts. This can help experts
                find new ways to connect with their audience and stay ahead of
                the competition.
              </li>
            </ul>
          </div>
          <div>
            <img
              src="bang.svg"
              className="max-w-lg lg:max-w-lg"
              alt="bang"
              height={293}
              width={305}
            />
          </div>
        </div>
        <div className="w-full h-full lg:px-10 lg:py-10 p-4 md:w-[984px] md:h-[120px]  rounded-[100px] border border-stone-300 backdrop-blur-[45px] flex-box flex-col bg-gradient-to-r from-blue-500 to-green-500 bg-clip-text  text-transparent">
          <div className="text-center text-md lg:text-[1.30rem] font-bold">
            Make the journey begin. Let your ideas shine and make your first
            podcast.{" "}
          </div>
        </div>
      </div>
    </>
  );
};
