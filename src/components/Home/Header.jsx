import { useNavigate } from "react-router-dom";
import { Info, LogIn, LogOut } from "lucide-react";
import { auth, provider } from "../../config/firebase.js";
import { signOut, getAuth } from "firebase/auth";
import { useEffect, useState } from "react";

export const Header = () => {
  const nav = useNavigate();
  const [user, setUser] = useState(null);
  const [photo, setPhoto] = useState("");

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
        const usr = getAuth();
        const aut = usr.currentUser;
        // const photo = aut.photoURL;
        setPhoto(aut.photoURL);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogOut = async () => {
    const currentProvider = user.providerData[0].providerId;

    await signOut(auth, provider[currentProvider])
      .then(() => {
        console.log("sad to see you go :(");

        const user = auth.currentUser;
        console.log(user);
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  return (
    <>
      <div className="navbar bg-info shadow-lg h-[4rem] flex justify-between">
        <div className="">
          <div
            className="btn btn-ghost normal-case text-xl"
            onClick={() => nav("/")}
          >
            <img src="logo.svg" alt="Logo" className="w-7 h-7" />
            SpotifAI
          </div>
        </div>
        <div className="flex-none gap-2">
          {user ? (
            <div className="dropdown dropdown-end">
              <label
                tabIndex={0}
                className=" btn btn-ghost btn-circle avatar bg-secondary"
              >
                <div className="w-full rounded-full h-full">
                  {photo ? (
                    <img src={photo} alt="profil" />
                  ) : (
                    <img src="user.png" alt="profil" />
                  )}
                </div>
              </label>
              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content mt-3 z-[5] p-2 shadow bg-base-100 border border-primary rounded-box w-36"
              >
                <li>
                  <button onClick={() => handleLogOut()}>
                    <span className="px-2">Logout</span>
                    <LogOut />
                  </button>
                  <button onClick={() => nav("/about")}>
                  <Info />

                    <span className="px-2">About</span>
                  </button>
                </li>
              </ul>
            </div>
          ) : (
            <>
              <div onClick={() => nav("/sign-in")}>
                <div className="btn btn-outline rounded-full capitalize font-neov w-28">
                  Login &nbsp;
                  <LogIn />
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};
