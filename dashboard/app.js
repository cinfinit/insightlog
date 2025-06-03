let allLogs = [];

async function fetchLogs() {
  const res = await fetch("/api/logs");
  if (!res.ok) return [];

  const logs = await res.json();
  return logs;
}

function renderLogs(logs) {
  const tableBody = document.querySelector("#logTable tbody");
  tableBody.innerHTML = "";

  logs.forEach((log) => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${new Date(log.timestamp).toLocaleString()}</td>
      <td class="level-${log.level}">${log.level.toUpperCase()}</td>
      <td>${log.args?.join(" ")}</td>
      <td>${log.context?.file || "-"}</td>
      <td>${log.context?.functionName || "-"}</td>
   
    `;
    //   <td>${log.repeatCount || 1}</td>
    tableBody.appendChild(row);
  });
}

function applyFilters(logs) {
  const level = document.getElementById("levelFilter").value;
  const search = document.getElementById("textSearch").value.toLowerCase();
  const start = document.getElementById("startTime").value;
  const end = document.getElementById("endTime").value;

  return logs.filter((log) => {
    if (level && log.level !== level) return false;

    const message = log.args?.join(" ").toLowerCase() || "";
    if (search && !message.includes(search)) return false;

    const time = new Date(log.timestamp).getTime();
    if (start && time < new Date(start).getTime()) return false;
    if (end && time > new Date(end).getTime()) return false;

    return true;
  });
}

async function loadDashboard() {
  allLogs = await fetchLogs();
  const filtered = applyFilters(allLogs);
  renderLogs(filtered);
}

function setupFilters() {
  const inputs = ["levelFilter", "textSearch", "startTime", "endTime"];
  inputs.forEach((id) => {
    document.getElementById(id).addEventListener("input", () => {
      const filtered = applyFilters(allLogs);
      renderLogs(filtered);
    });
  });
}

function startPolling(interval = 3000) {
  setInterval(loadDashboard, interval);
}

// Init
setupFilters();
loadDashboard();
startPolling(3000);
