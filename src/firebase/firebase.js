import { initializeApp } from "firebase/app";
import * as firebase from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import firebaseConfig from "./firebaseConfig";

firebase.setLogLevel("silent");
export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const db = getFirestore(app);
