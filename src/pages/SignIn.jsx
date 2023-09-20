import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import { Header } from "../components/Home/Header";

import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth, provider } from "../config/firebase";


export const SignIn = () => {
  const nav = useNavigate();

  const [user, setUser] = useState(null);
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
        nav("/chat");
      } else {
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleGoogleSingIn = async () => {
    await signInWithPopup(auth, provider["google.com"])
      .then((result) => {
        nav("/chat");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        const email = error.customData.email;
        const credential = GoogleAuthProvider.credentialFromError(error);
      });
  };

  return (
    <>
      <Header />
      <section className="h-screen w-full flex justify-center items-center px-6 lg:px-0">
        <div className="lg:h-[60%] lg:w-[45%] w-full h-[40%] flex justify-center items-center border rounded-[3rem] bg-[#13011F] relative shadow-lg border-stone-300">
          <div className="flex flex-col justify-center lg:w-[60%] w-full px-6 gap-5">
            <h3 className="font-bold text-xl lg:text-5xl text-left">
              Register
            </h3>
            <p className="font-normal text-base text-left">
              Welcome on a new adventure.try our magic now..!
            </p>

            <button
              className="btn btn-outline lg:hover:btn-primary rounded-full capitalize font-neov btn-block justify-start"
              onClick={handleGoogleSingIn}
              
            >
              <img alt="google" className="h-5 w-5" src="google.svg"/>
              Register using Google
            </button>
            <img
              src="register-img.svg"
              alt="smilie face"
              className="absolute lg:top-6 lg:right-6 -top-6 -right-8 scale-50 lg:scale-100"
            />
          </div>
        </div>
      </section>
    </>
  );
};
