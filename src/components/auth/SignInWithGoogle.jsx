import React from "react";
import { auth, db } from "../../firebase/firebase";
import { FaGoogle } from "react-icons/fa";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { getRedirectResult, GoogleAuthProvider, signInWithRedirect } from "firebase/auth";

function SignInWithGoogle({ setError }) {
  // function to sign in with google (redirect => preferred on mobile) and add user to firestore if not already present
  const signIn = () => {
    const provider = new GoogleAuthProvider();
    signInWithRedirect(auth, provider);
  };

  // handle redirect result and update user info in firestore db
  getRedirectResult(auth)
    .then(async (res) => {
      if (res == null) return;
      const docSnap = await getDoc(doc(db, "users", res.user.uid));
      if (!docSnap.exists()) {
        setDoc(doc(db, "users", res.user.uid), {
          displayName: res.user.displayName,
          photoURL: res.user.photoURL || "https://cdn-icons-png.flaticon.com/512/3177/3177440.png",
          messagesSent: 0,
        });
        return;
      }
      updateDoc(doc(db, "users", res.user.uid), {
        displayName: res.user.displayName,
        photoURL: res.user.photoURL || "https://cdn-icons-png.flaticon.com/512/3177/3177440.png",
      });
    })
    .catch(() => {
      setError("An internal error occurred");
    });

  return <FaGoogle onClick={() => signIn()} className="p-2 bg-red-600 text-white rounded-full hover:scale-[1.1] hover:cursor-pointer transition-transform duration-300" />;
}

export default SignInWithGoogle;
