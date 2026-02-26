/* ===============================
   LOGIN ROUTING (kept inside IIFE)
   =============================== */
(function () {
  function qs(sel) {
    return document.querySelector(sel);
  }

  var loginForm = qs('[data-page="login"]');

  if (loginForm) {
    loginForm.addEventListener('submit', function (e) {
      e.preventDefault();

      var role = qs('#role');
      var roleValue = role ? role.value : 'User';

      if (roleValue === 'Admin') {
        window.location.href = '/admin';
      } else {
        window.location.href = '/monitoring';
      }
    });
  }
})();

/* ===============================
   MODAL FUNCTIONS (GLOBAL)
   =============================== */
function openModal(id) {
  var modal = document.getElementById(id);
  if (modal) {
    modal.style.display = 'flex';
  }
}

function closeModal(id) {
  var modal = document.getElementById(id);
  if (modal) {
    modal.style.display = 'none';
  }
}
/* ===============================
   MONITORING METRICS UPDATE (ADD ONLY)
   =============================== */

(function () {

  function updateMonitoringMetrics() {

    fetch('/api/stats')

      .then(response => response.json())

      .then(data => {

        if (!data) return;


        // CAM-01

        if (data.metrics) {

          document.getElementById("metric-fire").innerText =
            (data.metrics.fire_conf * 100).toFixed(1) + "%";

          document.getElementById("metric-smoke").innerText =
            (data.metrics.smoke_conf * 100).toFixed(1) + "%";

          document.getElementById("metric-latency").innerText =
            data.metrics.latency + " ms";

        }


        // CAM-02

        if (data.cam2) {

          document.getElementById("metric-fire-cam2").innerText =
            (data.cam2.fire_conf * 100).toFixed(1) + "%";

          document.getElementById("metric-smoke-cam2").innerText =
            (data.cam2.smoke_conf * 100).toFixed(1) + "%";

          document.getElementById("metric-latency-cam2").innerText =
            data.cam2.latency + " ms";

        }


        // CAM-03

        if (data.cam3) {

          document.getElementById("metric-fire-cam3").innerText =
            (data.cam3.fire_conf * 100).toFixed(1) + "%";

          document.getElementById("metric-smoke-cam3").innerText =
            (data.cam3.smoke_conf * 100).toFixed(1) + "%";

          document.getElementById("metric-latency-cam3").innerText =
            data.cam3.latency + " ms";

        }


      })

      .catch(err => console.log(err));

  }


  // update every 5 seconds

  setInterval(updateMonitoringMetrics, 5000);


  // first load

  updateMonitoringMetrics();


})();