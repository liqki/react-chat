import React, { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { IoMdLogOut } from "react-icons/io";
import { FaPen, FaCheck, FaTimes } from "react-icons/fa";
import { auth, db } from "../../firebase/firebase";
import { updateProfile } from "firebase/auth";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";

function TopBar() {
  // get current user from context
  const { user } = useContext(AuthContext);
  // state for editing the username
  const [editUsername, setEditUsername] = useState(false);
  const [username, setUsername] = useState(user.displayName);

  // useEffect(() => {
  //   const unsubscribe = () =>
  //     onSnapshot(doc(db, "users", user.uid), (doc) => {
  //       if (doc.exists()) {
  //         setMessagesSent(doc.data().messagesSent);
  //       }
  //     });

  //   return () => unsubscribe();
  // }, []);

  // function to get text width to set input width
  const getTextWidth = (text) => {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    context.font = "18px Roboto, sans-serif";
    return context.measureText(text).width;
  };

  // function to update username
  const updateUsername = async () => {
    if (username === user.displayName) return setEditUsername(false);
    if (username === "") return;
    if (username.length > 10) return;
    await updateProfile(user, { displayName: username });
    await updateDoc(doc(db, "users", user.uid), {
      displayName: username,
    });
    setEditUsername(false);
  };

  return (
    <div className="bg-white lg:w-[65vw] w-screen h-16 flex mb-2 items-center justify-between lg:rounded-md rounded-b-md">
      <div className="flex items-center">
        <img src={user.photoURL} referrerPolicy="no-referrer" className="w-14 h-14 ml-1 rounded-full" />
        {editUsername ? (
          <input
            onChange={(e) => setUsername(e.target.value)}
            style={{ width: getTextWidth(username), minWidth: getTextWidth(user.displayName) }}
            autoFocus
            type="text"
            maxLength={10}
            placeholder={user.displayName}
            className="text-lg ml-3 focus:outline-none max-w-[175px]"
          />
        ) : (
          <h2 className="text-lg ml-3">{user.displayName}</h2>
        )}
        {!editUsername && <FaPen className="text-[#acacac] ml-2 text-xs" onClick={() => setEditUsername(true)} />}
        {editUsername && <FaCheck className="text-[#acacac] ml-2 text-sm" onClick={() => updateUsername()} />}
        {editUsername && <FaTimes className="text-[#acacac] ml-1" onClick={() => setEditUsername(false)} />}
      </div>
      <div className="flex items-center">
        <IoMdLogOut onClick={() => auth.signOut()} className="text-2xl mr-1 text-[#acacac]" />
      </div>
    </div>
  );
}

export default TopBar;
