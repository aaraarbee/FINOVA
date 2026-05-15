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

const transactionForm =
  document.getElementById("transactionForm");

const transactionTableBody =
  document.getElementById("transactionTableBody");

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

    loadTransactions();

  }

  else {

    window.location.href = "login.html";

  }

});

/* =========================
   ADD TRANSACTION
========================= */

if (transactionForm) {

  transactionForm.addEventListener(

    "submit",

    async (e) => {

      e.preventDefault();

      const category =
        document.getElementById("category").value;

      const description =
        document.getElementById("description").value;

      const amount =
        document.getElementById("amount").value;

      const date =
        document.getElementById("date").value;

      try {

        await addDoc(

          collection(db, "transactions"),

          {

            uid: currentUser.uid,

            category,
            description,
            amount,
            date,

            createdAt: new Date()

          }

        );

        alert("Transaction Added!");

        transactionForm.reset();

        loadTransactions();

      }

      catch (error) {

        alert(error.message);

      }

    }

  );

}

/* =========================
   LOAD TRANSACTIONS
========================= */

async function loadTransactions() {

  transactionTableBody.innerHTML = "";

  const q = query(

    collection(db, "transactions"),

    where("uid", "==", currentUser.uid)

  );

  const querySnapshot = await getDocs(q);

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

          <button
            class="btn btn-danger btn-sm"
            onclick="deleteTransaction('${docItem.id}')">

            Delete

          </button>

        </td>

      </tr>

    `;

    transactionTableBody.innerHTML += row;

  });

}

/* =========================
   DELETE TRANSACTION
========================= */

window.deleteTransaction =
  async function (id) {

    try {

      await deleteDoc(

        doc(db, "transactions", id)

      );

      loadTransactions();

    }

    catch (error) {

      alert(error.message);

    }

  };