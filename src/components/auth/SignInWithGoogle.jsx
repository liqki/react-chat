import React from "react";
import { useSignInWithGoogle } from "react-firebase-hooks/auth";
import { auth, db } from "../../firebase/firebase";
import { FaGoogle } from "react-icons/fa";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { GoogleAuthProvider, signInWithRedirect } from "firebase/auth";
import { isMobile } from "react-device-detect";

function SignInWithGoogle({ setError }) {
  // get signInWithGoogle function from react-firebase-hooks
  const [signInWithGoogle, error] = useSignInWithGoogle(auth);

  // function to sign in with google (popup) and add user to firestore if not already present
  const signIn = () => {
    signInWithGoogle().then(async (res) => {
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
    });
  };

  // function to sign in with google (redirect => preferred on mobile) and add user to firestore if not already present
  const signInOnMobile = () => {
    const provider = new GoogleAuthProvider();
    signInWithRedirect(auth, provider)
      .then(async (res) => {
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
      .catch((error) => {
        setError("An internal error occurred");
      });
  };

  if (error) return setError("An internal error occurred");
  return (
    <FaGoogle onClick={() => (isMobile ? signInOnMobile() : signIn())} className="p-2 bg-red-600 text-white rounded-full hover:scale-[1.1] hover:cursor-pointer transition-transform duration-300" />
  );
}

export default SignInWithGoogle;
