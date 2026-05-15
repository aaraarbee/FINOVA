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

const highestCategory =
  document.getElementById("highestCategory");

const transactionCount =
  document.getElementById("transactionCount");

const monthlyExpense =
  document.getElementById("monthlyExpense");

/* =========================
   AUTH CHECK
========================= */

onAuthStateChanged(auth, async (user) => {

  if (user) {

    loadAnalytics(user.uid);

  }

  else {

    window.location.href = "login.html";

  }

});

/* =========================
   LOAD ANALYTICS
========================= */

async function loadAnalytics(uid) {

  const q = query(

    collection(db, "transactions"),

    where("uid", "==", uid)

  );

  const querySnapshot =
    await getDocs(q);

  let totalExpense = 0;

  let categoryTotals = {};

  let totalTransactions = 0;

  querySnapshot.forEach((docItem) => {

    const data = docItem.data();

    const amount =
      Number(data.amount);

    totalExpense += amount;

    totalTransactions++;

    /* CATEGORY TOTALS */

    if (categoryTotals[data.category]) {

      categoryTotals[data.category] += amount;

    }

    else {

      categoryTotals[data.category] = amount;

    }

  });

  /* FIND HIGHEST CATEGORY */

  let highest = 0;

  let highestName = "None";

  for (const category in categoryTotals) {

    if (categoryTotals[category] > highest) {

      highest = categoryTotals[category];

      highestName = category;

    }

  }

  /* UPDATE CARDS */

  highestCategory.innerText =
    `${highestName} ₹${highest}`;

  transactionCount.innerText =
    totalTransactions;

  monthlyExpense.innerText =
    `₹${totalExpense}`;

  /* CREATE CHARTS */

  createBarChart(categoryTotals);

  createPieChart(categoryTotals);

}

/* =========================
   BAR CHART
========================= */

function createBarChart(categoryTotals) {

  const ctx =
    document.getElementById("analyticsBarChart");

  new Chart(ctx, {

    type: "bar",

    data: {

      labels:
        Object.keys(categoryTotals),

      datasets: [

        {

          label: "Expenses",

          data:
            Object.values(categoryTotals),

          backgroundColor: [

            "#0f2747",
            "#58b7a8",
            "#d8a657",
            "#183b68",
            "#7dd3c7"

          ],

          borderRadius: 12

        }

      ]

    },

    options: {

      responsive: true,

      plugins: {

        legend: {
          display: false
        }

      }

    }

  });

}

/* =========================
   PIE CHART
========================= */

function createPieChart(categoryTotals) {

  const ctx =
    document.getElementById("analyticsPieChart");

  new Chart(ctx, {

    type: "doughnut",

    data: {

      labels:
        Object.keys(categoryTotals),

      datasets: [

        {

          data:
            Object.values(categoryTotals),

          backgroundColor: [

            "#0f2747",
            "#58b7a8",
            "#d8a657",
            "#183b68",
            "#7dd3c7"

          ],

          borderWidth: 0

        }

      ]

    },

    options: {

      responsive: true,

      cutout: "70%"

    }

  });

}