/* =========================
   FIREBASE IMPORTS
========================= */

import { initializeApp }

from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {

  getAuth

}

from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {

  getFirestore

}

from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

/* =========================
   FIREBASE CONFIG
========================= */

const firebaseConfig = {
  apiKey: "AIzaSyDS_YLS_A_ws9beVP9gtrtFRiWEoX7LTCE",
  authDomain: "finova-113e2.firebaseapp.com",
  projectId: "finova-113e2",
  storageBucket: "finova-113e2.firebasestorage.app",
  messagingSenderId: "1036188875630",
  appId: "1:1036188875630:web:5ae9cea65fc405c0461f7f",
  measurementId: "G-K4QCF635TP"
};

/* =========================
   INITIALIZE FIREBASE
========================= */

const app = initializeApp(firebaseConfig);

/* =========================
   SERVICES
========================= */

const auth = getAuth(app);

const db = getFirestore(app);

/* =========================
   EXPORTS
========================= */

export {

  auth,
  db

};