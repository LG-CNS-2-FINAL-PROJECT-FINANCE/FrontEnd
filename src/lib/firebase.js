import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging";

//Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB-1S4Wez2ZUpgMSyTGzVG1eSiO6V6digg",
  authDomain: "zzogaemall-e8200.firebaseapp.com",
  projectId: "zzogaemall-e8200",
  storageBucket: "zzogaemall-e8200.firebasestorage.app",
  messagingSenderId: "173010769933",
  appId: "1:173010769933:web:a058435ed50c3e1fe09d44",
};

const app = initializeApp(firebaseConfig);
export const messaging = getMessaging(app);
