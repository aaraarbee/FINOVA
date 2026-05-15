/* =========================
   IMPORTS
========================= */

import {

  db,
  auth

} from "./firebase.js";

import {

  collection,
  getDocs,
  query,
  where

}

from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import {

  onAuthStateChanged

}

from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

/* =========================
   ELEMENTS
========================= */

const balanceAmount =
  document.getElementById("balanceAmount");

const spendingAmount =
  document.getElementById("spendingAmount");

const savingsAmount =
  document.getElementById("savingsAmount");

const budgetAmount =
  document.getElementById("budgetAmount");

/* =========================
   AUTH CHECK
========================= */

onAuthStateChanged(auth, async (user) => {

  if (user) {

    loadDashboardData(user.uid);

  }

  else {

    window.location.href = "login.html";

  }

});

/* =========================
   LOAD DASHBOARD DATA
========================= */

async function loadDashboardData(uid) {

  const q = query(

    collection(db, "transactions"),

    where("uid", "==", uid)

  );

  const querySnapshot =
    await getDocs(q);

  let totalSpending = 0;

  querySnapshot.forEach((docItem) => {

    const data = docItem.data();

    totalSpending += Number(data.amount);

  });

  /* DUMMY CALCULATIONS */

  const totalBalance = 124000;

  const savings =
    totalBalance - totalSpending;

  const budgetLeft =
    40000 - totalSpending;

  /* UPDATE UI */

  balanceAmount.innerText =
    `₹${totalBalance.toLocaleString()}`;

  spendingAmount.innerText =
    `₹${totalSpending.toLocaleString()}`;

  savingsAmount.innerText =
    `₹${savings.toLocaleString()}`;

  budgetAmount.innerText =
    `₹${budgetLeft.toLocaleString()}`;

}