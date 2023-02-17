import React, { useState } from "react";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, db } from "../firebase/firebase";
import { Link, useNavigate } from "react-router-dom";
import SignInWithGoogle from "../components/auth/SignInWithGoogle";
import ResetPassword from "../components/auth/ResetPassword";
import { doc, setDoc } from "firebase/firestore";

function Login({ register }) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // sign in with email and password
  const signIn = (e) => {
    e.preventDefault();
    const email = e.target[1].value;
    const password = e.target[2].value;

    if (!email || !password) {
      setError("Please fill all the fields");
      return;
    }

    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        navigate("/");
      })
      .catch((error) => {
        if (error.code === "auth/user-not-found") setError("This email is not registered");
        else if (error.code === "auth/wrong-password") setError("Incorrect password");
      });
  };

  // sign up with email and password
  const signUp = async (e) => {
    e.preventDefault();
    const username = e.target[0].value;
    const email = e.target[1].value;
    const password = e.target[2].value;

    if (!username || !email || !password) {
      setError("Please fill all the fields");
      return;
    }

    if (password.length < 6) {
      setError("Please provide a more secure password");
      return;
    }

    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(res.user, { displayName: username, photoURL: res.user.photoURL || "https://cdn-icons-png.flaticon.com/512/3177/3177440.png" });
      await setDoc(doc(db, "users", res.user.uid), {
        displayName: username,
        photoURL: res.user.photoURL || "https://cdn-icons-png.flaticon.com/512/3177/3177440.png",
        messagesSent: 0,
      });
      navigate("/");
    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        setError("This email is already registered");
        return;
      }
      setError("An internal error occurred");
    }
  };

  return (
    <div className="h-screen w-screen bg-gradient-to-tr from-cyan-400 to-pink-400 text-dark flex justify-center items-center noselect">
      <div className="md:w-96 md:p-16 medheight:h-4/5 lowheight:h-[90%] lowheight:py-4 w-64 p-4 bg-[#f1f1f1] h-2/3 rounded-lg flex flex-col justify-between items-center relative">
        <h1 className="text-2xl font-bold">{register ? "Sign Up" : "Login"}</h1>
        <form className="md:w-64 flex flex-col gap-2" onSubmit={register ? signUp : signIn}>
          <label htmlFor="username" className={`md:text-sm text-xs ${!register && "hidden"}`}>
            Username
          </label>
          <input type="text" name="username" placeholder="Type your username" className={`border-b-[1px] bg-light border-[#d4d2d2] pb-2 focus:outline-none ${!register && "hidden"}`} />
          <label htmlFor="email" className="md:text-sm text-xs">
            Email
          </label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            name="email"
            placeholder="Type your email"
            className="border-b-[1px] bg-light border-[#d4d2d2] pb-2 focus:outline-none"
          />
          <label htmlFor="password" className="md:text-sm text-xs mt-5">
            Password
          </label>
          <input type="password" name="password" placeholder="Type your password" className="border-b-[1px] bg-light border-[#d4d2d2] pb-2 focus:outline-none" />
          <ResetPassword register={register} email={email} setError={setError} />
          <button type="submit" className="bg-gradient-to-r from-cyan-400 to-pink-400 py-2 rounded-full mt-2 text-white hover:scale-x-[1.1] transition-transform duration-300">
            {register ? "Sign Up" : "Login"}
          </button>
          {error && <p className="text-red-500 text-center mb-2">{error}</p>}
        </form>
        <div className="mt-2 mb-5">
          <p className="text-center">Sign in using</p>
          <div className="flex justify-center gap-4 text-4xl mt-4">
            <SignInWithGoogle setError={setError} />
          </div>
        </div>
        <div className="flex flex-col items-center">
          <p className="text-center">{register ? "Already have an account?" : "Don't have an account?"}</p>
          <Link to={register ? "/" : "/register"} className="text-blue-500 hover:cursor-pointer">
            {register ? "Login here" : "Sign Up"}
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
