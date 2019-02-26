let leaderboard

///////////////////////////////////////////////////////////////////////////////

function getWins(user) {
  return user.duels.filter(duel => duel.win).length
}

function compareWins(a,b) {
  if (getWins(a) < getWins(b))
     return -1
  if (getWins(a) > getWins(b))
    return 1
  return 0
}

function renderLeaderboard() {
  fetch('http://localhost:3000/api/v1/users')
  .then(result => result.json())
  .then(parsedResult => {
    let sortedResult = parsedResult.sort(compareWins).reverse()
    leaderboard = sortedResult.map(user => {
      return `<li>${getWins(user)} <i class="user outline icon"></i>${user.username}</li>`
    }).join('')
    return leaderboard
  })
}

///////////////////////////////////////////////////////////////////////////////

renderLeaderboard()
