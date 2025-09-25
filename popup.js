document.addEventListener("DOMContentLoaded", async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  chrome.tabs.sendMessage(tab.id, { action: "getLobbyPlayers" }, (teams) => {
    if (!teams || Object.keys(teams).length === 0) {
      document.getElementById("stats").innerText = "Игроки не найдены";
      return;
    }

    chrome.runtime.sendMessage({ action: "fetchPlayersStats", teams }, (results) => {
      if (!results) {
        document.getElementById("stats").innerText = "Ошибка загрузки статистики";
        return;
      }

      let html = "";
      let grouped = {};

      results.forEach(r => {
        if (!grouped[r.team]) grouped[r.team] = [];
        grouped[r.team].push(r);
      });

      for (let team in grouped) {
        html += `<h4>${team}</h4>`;
        grouped[team].forEach(p => {
          html += `<div class="player"><b>${p.nickname}</b> → <span class="kills">${p.kills.join(", ")}</span> (avg=${p.avg})</div>`;
        });
      }

      document.getElementById("stats").innerHTML = html;
    });
  });
});