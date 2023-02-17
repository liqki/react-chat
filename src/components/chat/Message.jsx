import { doc, getDoc, onSnapshot } from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { db } from "../../firebase/firebase";

function Message({ message, timestamp, sender }) {
  // get current user from context and check if the message is sent by the current user
  const { user } = useContext(AuthContext);
  const isSender = user.uid === sender;
  // state for sender name and photo
  const [senderInfo, setSenderInfo] = useState({});
  const [date, setDate] = useState(null);

  // get sender info from db
  useEffect(() => {
    const unsubscribe = () =>
      onSnapshot(doc(db, "users", sender), (doc) => {
        if (doc.exists()) {
          setSenderInfo({
            displayName: doc.data().displayName,
            photoURL: doc.data().photoURL,
          });
        }
      });

    return () => unsubscribe();
  }, []);

  // get date from timestamp
  useEffect(() => {
    if (!timestamp) return;
    setDate(new Date(timestamp.seconds * 1000));
  }, [timestamp]);

  // functin to format date to hh:mm
  const formatDate = (date) => {
    if (!date) return;
    return (date.getHours() < 10 ? "0" : "") + date.getHours() + ":" + (date.getMinutes() < 10 ? "0" : "") + date.getMinutes();
  };

  return (
    <>
      {/* message is sent by current user */}
      {isSender && (
        <div className="flex">
          <div className="flex flex-col">
            <span className="ml-auto mr-2">{user.displayName}</span>
            <div className="bg-cyan-400 mr-2 -mt-1 rounded-tr-none flex gap-2 rounded-2xl text-lg my-1 p-1 px-2 min-w-[40px] max-w-[270px]">
              {message}
              <span className="text-xs mt-auto">{formatDate(date)}</span>
            </div>
          </div>
          <img src={user.photoURL ? user.photoURL : ""} className="w-10 h-10 rounded-full mr-1" />
        </div>
      )}
      {/* message is sent by other user */}
      {!isSender && (
        <div className="flex mr-auto">
          <img src={senderInfo.photoURL ? senderInfo.photoURL : ""} className="w-10 h-10 rounded-full ml-1" />
          <div className="flex flex-col">
            <span className="mr-auto ml-2">{senderInfo.displayName}</span>
            <div className="bg-pink-400 ml-2 -mt-1 rounded-tl-none flex gap-2 rounded-2xl text-lg my-1 p-1 px-2 min-w-[40px] max-w-[270px]">
              {message}
              <span className="text-xs mt-auto">{formatDate(date)}</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Message;
