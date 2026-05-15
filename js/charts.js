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
   LOAD CHARTS
========================= */

onAuthStateChanged(auth, async (user) => {

  if (user) {

    loadCharts(user.uid);

  }

});

/* =========================
   CHART LOGIC
========================= */

async function loadCharts(uid) {

  const q = query(

    collection(db, "transactions"),

    where("uid", "==", uid)

  );

  const querySnapshot =
    await getDocs(q);

  let categoryTotals = {};

  let monthlyTotals = {};

  querySnapshot.forEach((docItem) => {

    const data = docItem.data();

    const amount =
      Number(data.amount);

    /* CATEGORY */

    if (categoryTotals[data.category]) {

      categoryTotals[data.category] += amount;

    }

    else {

      categoryTotals[data.category] = amount;

    }

    /* MONTH */

    const month =
      new Date(data.date)
      .toLocaleString("default", {

        month: "short"

      });

    if (monthlyTotals[month]) {

      monthlyTotals[month] += amount;

    }

    else {

      monthlyTotals[month] = amount;

    }

  });

  createLineChart(monthlyTotals);

  createPieChart(categoryTotals);

}

/* =========================
   LINE CHART
========================= */

function createLineChart(monthlyTotals) {

  const ctx =
    document.getElementById("spendingChart");

  new Chart(ctx, {

    type: "line",

    data: {

      labels:
        Object.keys(monthlyTotals),

      datasets: [

        {

          label: "Monthly Spending",

          data:
            Object.values(monthlyTotals),

          borderColor: "#58b7a8",

          backgroundColor:
            "rgba(88,183,168,0.2)",

          tension: 0.4,

          fill: true

        }

      ]

    },

    options: {

      responsive: true

    }

  });

}

/* =========================
   PIE CHART
========================= */

function createPieChart(categoryTotals) {

  const ctx =
    document.getElementById("categoryChart");

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