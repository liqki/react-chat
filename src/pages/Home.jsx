import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import React, { useEffect, useRef, useState } from "react";
import Message from "../components/chat/Message";
import MessageInput from "../components/chat/MessageInput";
import TopBar from "../components/chat/TopBar";
import { db } from "../firebase/firebase";

function Home() {
  const [messages, setMessages] = useState([]);
  const scrollElement = useRef();
  const collectionRef = collection(db, "messages");
  const q = query(collectionRef, orderBy("timestamp"));

  // get messages from db and set them to state
  useEffect(() => {
    const unsubscribe = onSnapshot(q, (snapshot) => {
      let msgs = [];
      snapshot.forEach((doc) => {
        msgs.push(doc);
      });
      setMessages(msgs);
    });

    return () => unsubscribe();
  }, []);

  // scroll to bottom of chat on new message
  useEffect(() => {
    scrollElement.current.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="h-screen w-screen bg-gradient-to-tr from-cyan-400 to-pink-400 text-dark flex flex-col lg:justify-center justify-between items-center noselect">
      <div>
        <TopBar />
      </div>
      <div className="lg:h-[70vh] h-[calc(100vh-64px)] overflow-scroll hidescrollbar">
        <div className="lg:w-[65vw] w-screen flex flex-col justify-end items-end ">
          {messages.map((message) => (
            <Message key={message.id} message={message.data().message} sender={message.data().user} timestamp={message.data().timestamp} />
          ))}
        </div>
        <div ref={scrollElement} />
      </div>
      <div className="w-screen flex justify-between items-center mb-1">
        <MessageInput scrollElement={scrollElement} />
      </div>
    </div>
  );
}

export default Home;
