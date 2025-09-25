function extractPlayers() {
  const players = [];
  
  // ищем ссылки на профили игроков
  document.querySelectorAll('a[href*="/players/"]').forEach(link => {
    const nickname = link.textContent.trim();
    if (nickname) {
      players.push({
        nickname,
        profileUrl: link.href
      });
    }
  });

  return players;
}

// Ждём подгрузки DOM
setTimeout(() => {
  const players = extractPlayers();
  chrome.runtime.sendMessage({ players });
}, 3000);
