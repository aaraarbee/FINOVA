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
  where,
  limit

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

const dashboardTransactionBody =
  document.getElementById("dashboardTransactionBody");

/* =========================
   AUTH CHECK
========================= */

onAuthStateChanged(auth, async (user) => {

  if (user) {

    loadDashboardData(user.uid);

  }

  else {

    window.location.href =
      "login.html";

  }

});

/* =========================
   LOAD DASHBOARD DATA
========================= */

async function loadDashboardData(uid) {

  try {

    /* TRANSACTIONS */

    const transactionQuery = query(

      collection(db, "transactions"),

      where("uid", "==", uid)

    );

    const transactionSnapshot =
      await getDocs(transactionQuery);

    let totalSpending = 0;

    transactionSnapshot.forEach((docItem) => {

      const data = docItem.data();

      totalSpending +=
        Number(data.amount);

    });

    /* BUDGET */

    const budgetQuery = query(

      collection(db, "budgets"),

      where("uid", "==", uid)

    );

    const budgetSnapshot =
      await getDocs(budgetQuery);

    let latestBudget = 0;

    budgetSnapshot.forEach((docItem) => {

      latestBudget =
        Number(docItem.data().amount);

    });

    /* CALCULATIONS */

    const totalBalance =
      latestBudget;

    const savings =
      latestBudget - totalSpending;

    const budgetLeft =
      latestBudget - totalSpending;

    /* UPDATE UI */

    balanceAmount.innerText =
      `₹${totalBalance.toLocaleString()}`;

    spendingAmount.innerText =
      `₹${totalSpending.toLocaleString()}`;

    savingsAmount.innerText =
      `₹${savings.toLocaleString()}`;

    budgetAmount.innerText =
      `₹${budgetLeft.toLocaleString()}`;

    /* LOAD RECENT TRANSACTIONS */

    loadRecentTransactions(uid);

  }

  catch (error) {

    console.error(error);

  }

}

/* =========================
   RECENT TRANSACTIONS
========================= */

async function loadRecentTransactions(uid) {

  try {

    dashboardTransactionBody.innerHTML = "";

    const q = query(

      collection(db, "transactions"),

      where("uid", "==", uid),

      limit(5)

    );

    const querySnapshot =
      await getDocs(q);

    querySnapshot.forEach((docItem) => {

      const data = docItem.data();

      const row = `

        <tr>

          <td>

            <span class="badge bg-primary">

              ${data.category}

            </span>

          </td>

          <td>

            ${data.description}

          </td>

          <td>

            ${data.date}

          </td>

          <td class="text-danger">

            ₹${data.amount}

          </td>

          <td>

            <span class="badge bg-success">

              Completed

            </span>

          </td>

        </tr>

      `;

      dashboardTransactionBody.innerHTML += row;

    });

  }

  catch (error) {

    console.error(error);

  }

}