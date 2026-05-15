/* =========================
   IMPORTS
========================= */

import {

  db,
  auth

} from "./firebase.js";

import {

  collection,
  addDoc,
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

const budgetForm =
  document.getElementById("budgetForm");

const totalBudget =
  document.getElementById("totalBudget");

const totalSpent =
  document.getElementById("totalSpent");

const remainingBudget =
  document.getElementById("remainingBudget");

const budgetPercent =
  document.getElementById("budgetPercent");

const budgetProgressBar =
  document.getElementById("budgetProgressBar");

/* =========================
   CURRENT USER
========================= */

let currentUser = null;

/* =========================
   AUTH CHECK
========================= */

onAuthStateChanged(auth, async (user) => {

  if (user) {

    currentUser = user;

    loadBudgetData();

  }

  else {

    window.location.href = "login.html";

  }

});

/* =========================
   SAVE BUDGET
========================= */

if (budgetForm) {

  budgetForm.addEventListener(

    "submit",

    async (e) => {

      e.preventDefault();

      const amount =
        document.getElementById("budgetInput").value;

      try {

        await addDoc(

          collection(db, "budgets"),

          {

            uid: currentUser.uid,

            amount: Number(amount),

            createdAt: new Date()

          }

        );

        alert("Budget Saved!");

        budgetForm.reset();

        loadBudgetData();

      }

      catch (error) {

        alert(error.message);

      }

    }

  );

}

/* =========================
   LOAD BUDGET DATA
========================= */

async function loadBudgetData() {

  /* GET BUDGET */

  const budgetQuery = query(

    collection(db, "budgets"),

    where("uid", "==", currentUser.uid)

  );

  const budgetSnapshot =
    await getDocs(budgetQuery);

  let latestBudget = 0;

  budgetSnapshot.forEach((docItem) => {

    latestBudget =
      docItem.data().amount;

  });

  /* GET TRANSACTIONS */

  const transactionQuery = query(

    collection(db, "transactions"),

    where("uid", "==", currentUser.uid)

  );

  const transactionSnapshot =
    await getDocs(transactionQuery);

  let spent = 0;

  transactionSnapshot.forEach((docItem) => {

    spent += Number(
      docItem.data().amount
    );

  });

  /* CALCULATIONS */

  const remaining =
    latestBudget - spent;

  const percent =
    latestBudget > 0

      ? (spent / latestBudget) * 100

      : 0;

  /* UPDATE UI */

  totalBudget.innerText =
    `₹${latestBudget}`;

  totalSpent.innerText =
    `₹${spent}`;

  remainingBudget.innerText =
    `₹${remaining}`;

  budgetPercent.innerText =
    `${percent.toFixed(1)}%`;

  budgetProgressBar.style.width =
    `${percent}%`;

}