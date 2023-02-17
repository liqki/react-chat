import { addDoc, collection, doc, increment, serverTimestamp, updateDoc } from "firebase/firestore";
import React, { useContext, useState } from "react";
import { isMobile } from "react-device-detect";
import { BsEmojiSunglasses } from "react-icons/bs";
import { FaCamera } from "react-icons/fa";
import { TbSend } from "react-icons/tb";
import TextareaAutosize from "react-textarea-autosize";
import { AuthContext } from "../../context/AuthContext";
import { db } from "../../firebase/firebase";

function MessageInput({ scrollElement }) {
  // get current user from context
  const { user } = useContext(AuthContext);
  // state for message input height and message
  const [height, setHeight] = useState(36);
  const [message, setMessage] = useState("");

  // function to handle enter press
  const onEnterPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // function to send message and store it in db
  const sendMessage = async () => {
    if (message === "") return;
    await addDoc(collection(db, "messages"), {
      message,
      timestamp: serverTimestamp(),
      user: user.uid,
    });
    await updateDoc(doc(db, "users", user.uid), {
      messagesSent: increment(1),
    });
    // scroll to bottom
    scrollElement.current.scrollIntoView({ behavior: "smooth" });
    setMessage("");
  };

  return (
    <div className="w-screen flex justify-center">
      <div className="lg:w-[50vw] w-screen flex justify-evenly items-end pt-3">
        <div style={{ height: height, borderRadius: height > 36 ? 20 : 9999, alignItems: height > 36 ? "flex-end" : "center" }} className="w-[85%] h-9 bg-white flex justify-evenly">
          {/* <BsEmojiSunglasses style={{ marginBottom: height > 36 ? 6 : 0 }} className="text-xl mx-[10px] text-[#c8c7c7]" /> */}
          <TextareaAutosize
            onHeightChange={(h) => {
              if (h > 36) {
                setHeight(h);
                return;
              }
              setHeight(36);
            }}
            onChange={(e) => setMessage(e.target.value)}
            value={message}
            onKeyDown={onEnterPress}
            maxRows={5}
            autoFocus={isMobile ? false : true}
            placeholder="Message"
            className="w-[75%] focus:outline-none placeholder:text-[#c8c7c7] caret-[#c8c7c7] resize-none"
          />
          {/* <FaCamera style={{ marginBottom: height > 36 ? 6 : 0 }} className="text-xl mx-[10px] text-[#c8c7c7]" /> */}
        </div>
        <button onClick={sendMessage} className="bg-pink-500 rounded-full p-[6px] text-2xl text-white">
          <TbSend />
        </button>
      </div>
    </div>
  );
}

export default MessageInput;
