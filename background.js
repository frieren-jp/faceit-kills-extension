async function fetchStats(url) {
  try {
    let res = await fetch(url);
    let html = await res.text();

    let doc = new DOMParser().parseFromString(html, "text/html");
    let rows = doc.querySelectorAll("table tbody tr");
    let kills = [];

    for (let i = 0; i < 3 && i < rows.length; i++) {
      let kadCell = rows[i].querySelectorAll("td")[6]; 
      if (kadCell) {
        let k = parseInt(kadCell.innerText.split("/")[0].trim(), 10);
        kills.push(k);
      }
    }

    while (kills.length < 3) kills.push(0);
    let avg = (kills.reduce((a, b) => a + b, 0) / 15).toFixed(2);

    return { kills, avg };
  } catch (err) {
    return { kills: [0, 0, 0], avg: 0 };
  }
}

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.action === "fetchPlayersStats") {
    let promises = [];

    for (let team in msg.teams) {
      msg.teams[team].forEach(player => {
        if (player.profileLink) {
          promises.push(
            fetchStats(player.profileLink + "/stats/cs2").then(stats => ({
              team,
              nickname: player.nickname,
              ...stats
            }))
          );
        }
      });
    }

    Promise.all(promises).then(results => sendResponse(results));
    return true; // async response
  }
});