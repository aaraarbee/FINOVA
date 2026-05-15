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
  deleteDoc,
  doc,
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

const subscriptionForm =
  document.getElementById("subscriptionForm");

const subscriptionTableBody =
  document.getElementById("subscriptionTableBody");

const monthlySubscriptionCost =
  document.getElementById("monthlySubscriptionCost");

const subscriptionCount =
  document.getElementById("subscriptionCount");

const nextRenewal =
  document.getElementById("nextRenewal");

/* =========================
   CURRENT USER
========================= */

let currentUser = null;

/* =========================
   AUTH CHECK
========================= */

onAuthStateChanged(auth, (user) => {

  if (user) {

    currentUser = user;

    loadSubscriptions();

  }

  else {

    window.location.href = "login.html";

  }

});

/* =========================
   SAVE SUBSCRIPTION
========================= */

if (subscriptionForm) {

  subscriptionForm.addEventListener(

    "submit",

    async (e) => {

      e.preventDefault();

      const name =
        document.getElementById("subscriptionName").value;

      const category =
        document.getElementById("subscriptionCategory").value;

      const amount =
        document.getElementById("subscriptionAmount").value;

      const renewalDate =
        document.getElementById("subscriptionDate").value;

      try {

        await addDoc(

          collection(db, "subscriptions"),

          {

            uid: currentUser.uid,

            name,
            category,
            amount,
            renewalDate,

            createdAt: new Date()

          }

        );

        alert("Subscription Added!");

        subscriptionForm.reset();

        loadSubscriptions();

      }

      catch (error) {

        alert(error.message);

      }

    }

  );

}

/* =========================
   LOAD SUBSCRIPTIONS
========================= */

async function loadSubscriptions() {

  subscriptionTableBody.innerHTML = "";

  const q = query(

    collection(db, "subscriptions"),

    where("uid", "==", currentUser.uid)

  );

  const querySnapshot =
    await getDocs(q);

  let totalCost = 0;

  let totalSubscriptions = 0;

  let nearestRenewal = null;

  querySnapshot.forEach((docItem) => {

    const data = docItem.data();

    totalCost += Number(data.amount);

    totalSubscriptions++;

    /* NEAREST DATE */

    if (

      !nearestRenewal ||

      new Date(data.renewalDate)
      < new Date(nearestRenewal)

    ) {

      nearestRenewal =
        data.renewalDate;

    }

    /* TABLE ROW */

    const row = `

      <tr>

        <td>

          ${data.name}

        </td>

        <td>

          <span class="badge bg-primary">

            ${data.category}

          </span>

        </td>

        <td>

          ${data.renewalDate}

        </td>

        <td class="text-danger">

          ₹${data.amount}

        </td>

        <td>

          <button
            class="btn btn-danger btn-sm"
            onclick="deleteSubscription('${docItem.id}')">

            Delete

          </button>

        </td>

      </tr>

    `;

    subscriptionTableBody.innerHTML += row;

  });

  /* UPDATE UI */

  monthlySubscriptionCost.innerText =
    `₹${totalCost}`;

  subscriptionCount.innerText =
    totalSubscriptions;

  nextRenewal.innerText =
    nearestRenewal || "--";

}

/* =========================
   DELETE SUBSCRIPTION
========================= */

window.deleteSubscription =
  async function (id) {

    try {

      await deleteDoc(

        doc(db, "subscriptions", id)

      );

      loadSubscriptions();

    }

    catch (error) {

      alert(error.message);

    }

  };