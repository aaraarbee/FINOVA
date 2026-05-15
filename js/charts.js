/* =========================
   SPENDING LINE CHART
========================= */

const spendingCanvas = document.getElementById("spendingChart");

if (spendingCanvas) {

  const ctx = spendingCanvas.getContext("2d");

  /* GRADIENT */

  const gradient = ctx.createLinearGradient(0, 0, 0, 400);

  gradient.addColorStop(0, "rgba(88,183,168,0.35)");
  gradient.addColorStop(1, "rgba(88,183,168,0)");

  new Chart(ctx, {

    type: "line",

    data: {

      labels: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun"
      ],

      datasets: [

        {
          label: "Expenses",

          data: [
            12000,
            19000,
            14000,
            24000,
            18000,
            26000
          ],

          borderColor: "#0f2747",

          backgroundColor: gradient,

          fill: true,

          tension: 0.4,

          borderWidth: 3,

          pointBackgroundColor: "#58b7a8",

          pointBorderColor: "#ffffff",

          pointBorderWidth: 3,

          pointRadius: 6,

          pointHoverRadius: 8

        }

      ]

    },

    options: {

      responsive: true,

      maintainAspectRatio: false,

      plugins: {

        legend: {
          display: false
        }

      },

      scales: {

        x: {

          grid: {
            display: false
          },

          ticks: {
            color: "#6b7280"
          }

        },

        y: {

          grid: {
            color: "rgba(0,0,0,0.05)"
          },

          ticks: {
            color: "#6b7280"
          }

        }

      }

    }

  });

}

/* =========================
   CATEGORY DOUGHNUT CHART
========================= */

const categoryCanvas = document.getElementById("categoryChart");

if (categoryCanvas) {

  const categoryCtx = categoryCanvas.getContext("2d");

  new Chart(categoryCtx, {

    type: "doughnut",

    data: {

      labels: [
        "Shopping",
        "Food",
        "Bills",
        "Travel",
        "Entertainment"
      ],

      datasets: [

        {

          data: [
            32,
            20,
            18,
            15,
            15
          ],

          backgroundColor: [

            "#0f2747",
            "#58b7a8",
            "#d8a657",
            "#183b68",
            "#7dd3c7"

          ],

          borderWidth: 0,

          hoverOffset: 10

        }

      ]

    },

    options: {

      responsive: true,

      cutout: "72%",

      plugins: {

        legend: {

          position: "bottom",

          labels: {

            padding: 18,

            usePointStyle: true,

            pointStyle: "circle",

            color: "#6b7280",

            font: {
              size: 13
            }

          }

        }

      }

    }

  });

}