/* =========================
   IMPORTS
========================= */

import {

  auth

} from "./firebase.js";

import {

  onAuthStateChanged,
  signOut

}

from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

/* =========================
   ELEMENTS
========================= */

const profileName =
  document.getElementById("profileName");

const profileEmail =
  document.getElementById("profileEmail");

const logoutBtn =
  document.getElementById("logoutBtn");

const darkModeToggle =
  document.getElementById("darkModeToggle");

/* =========================
   AUTH CHECK
========================= */

onAuthStateChanged(auth, (user) => {

  if (user) {

    /* DISPLAY USER */

    profileEmail.innerText =
      user.email;

    profileName.innerText =
      user.email.split("@")[0];

  }

  else {

    window.location.href =
      "login.html";

  }

});

/* =========================
   LOGOUT
========================= */

if (logoutBtn) {

  logoutBtn.addEventListener(

    "click",

    async () => {

      try {

        await signOut(auth);

        window.location.href =
          "login.html";

      }

      catch (error) {

        alert(error.message);

      }

    }

  );

}

/* =========================
   DARK MODE
========================= */

if (

  localStorage.getItem("theme")
  === "dark"

) {

  document.body.classList.add(
    "dark-mode"
  );

  darkModeToggle.checked = true;

}

darkModeToggle.addEventListener(

  "change",

  () => {

    document.body.classList.toggle(
      "dark-mode"
    );

    /* SAVE THEME */

    if (

      document.body.classList.contains(
        "dark-mode"
      )

    ) {

      localStorage.setItem(
        "theme",
        "dark"
      );

    }

    else {

      localStorage.setItem(
        "theme",
        "light"
      );

    }

  }

);