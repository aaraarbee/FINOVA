/* =========================
   IMPORTS
========================= */

import {

  auth

} from "./firebase.js";

import {

  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged

}

from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

/* =========================
   SIGNUP
========================= */

const signupForm = document.getElementById("signupForm");

if (signupForm) {

  signupForm.addEventListener("submit", async (e) => {

    e.preventDefault();

    const email =
      document.getElementById("email").value;

    const password =
      document.getElementById("password").value;

    try {

      await createUserWithEmailAndPassword(

        auth,
        email,
        password

      );

      alert("Account created successfully!");

      window.location.href = "dashboard.html";

    }

    catch (error) {

      alert(error.message);

    }

  });

}

/* =========================
   LOGIN
========================= */

const loginForm = document.getElementById("loginForm");

if (loginForm) {

  loginForm.addEventListener("submit", async (e) => {

    e.preventDefault();

    const email =
      document.getElementById("email").value;

    const password =
      document.getElementById("password").value;

    try {

      await signInWithEmailAndPassword(

        auth,
        email,
        password

      );

      alert("Login successful!");

      window.location.href = "dashboard.html";

    }

    catch (error) {

      alert(error.message);

    }

  });

}

/* =========================
   LOGOUT
========================= */

const logoutBtn =
  document.getElementById("logoutBtn");

if (logoutBtn) {

  logoutBtn.addEventListener("click", async () => {

    try {

      await signOut(auth);

      window.location.href = "login.html";

    }

    catch (error) {

      alert(error.message);

    }

  });

}

/* =========================
   AUTH PROTECTION
========================= */

onAuthStateChanged(auth, (user) => {

  const currentPage =
    window.location.pathname;

  /* PROTECT DASHBOARD */

  if (

    currentPage.includes("dashboard.html")

    && !user

  ) {

    window.location.href = "login.html";

  }

});