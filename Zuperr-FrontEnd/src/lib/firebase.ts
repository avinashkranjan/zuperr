import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyCqMV7uW3vfDtMwWrYByVp2J0ojco9_Xmw",
  authDomain: "zuperr-edd2b.firebaseapp.com",
  projectId: "zuperr-edd2b",
  storageBucket: "zuperr-edd2b.firebasestorage.app",
  messagingSenderId: "33918853566",
  appId: "1:33918853566:web:6a5bbbecfb629f856759ef",
  measurementId: "G-0BTZZ52E95",
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export { app, analytics };
