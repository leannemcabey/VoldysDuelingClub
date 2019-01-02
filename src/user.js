let activeUser
let playerSpell
let voldySpell

function findOrCreateUser(username) {
  fetch('http://localhost:3000/api/v1/users')
  .then( result => result.json() )
  .then( parsedResult => {
    const usernames = parsedResult.map( user => user.username )
    if (usernames.includes(username)) {
      activeUser = parsedResult.find( user => user.username === username )
      document.querySelector('#header').innerHTML += `<button id='signout'> Sign Out </button>`
      mainDiv.innerHTML = renderRulesPage()
    }
    else {
      fetch('http://localhost:3000/api/v1/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          username: username
        })
      })
      .then( result => result.json() )
      .then( parsedResult => {
        activeUser = parsedResult
        mainDiv.innerHTML = renderRulesPage()
      })
    }
  })
}

function renderRulesPage() {
  return `
    <h2> As you wish, ${activeUser.username}... </h2>
    <h4> The rules are simple. You and Voldy will each cast a spell.
         Whomever's spell is trumped by the other will lose the number of
         Health Points associated with the winning spell. Whoever runs out
         of Health Points first loses. But beware of casting Unforgivable
         Curses. The Dark Magic Meter will increase each time you do. If
         it reaches 100%, you have sent the wizarding world into a terrible,
         dark place, the game is over and you lose. If either of you cast
         the Killing Curse, your duel will be short lived. </h4>
    <button id='duel-button' data-id='${activeUser.id}'> Begin Duel </button>
  `
}

function getWins() {
  return activeUser.duels.filter( duel => duel.win === true ).length
}

function castSpell() {
  let spells = getSpells()
  let unforgivables = ['Avada Kedavra', 'Crucio', 'Imperio']
  playerSpell = spells.find( spell => spell.rank == event.target.dataset.id )
  voldySpell = spells[Math.floor(Math.random() * spells.length)]
  console.log(playerSpell, voldySpell)

  if (playerSpell === voldySpell) {
    return 'You and Voldy cast the same spell! No Health Points have been lost.'
  }
  else if (voldySpell.name === 'Avada Kedavra') {
    return ''
  }
  else if (playerSpell.name === 'Avada Kedavra') {
    return ''
  }
  else if (unforgivables.includes(playerSpell.name)) {
    return playerCastUnforgivableResult(playerSpell, voldySpell)
  }
  else if (playerSpell.rank < voldySpell.rank) {
    healthPoints.player = setWinnerPoints('player')
    healthPoints.voldy -= playerSpell.damage
    document.querySelector('#player-score').innerHTML = `Health Points: ${healthPoints.player}`
    document.querySelector('#voldy-score').innerHTML = `Health Points: ${healthPoints.voldy}`
    return 'Nice one! You beat Voldy!'
  }
  else if (playerSpell.rank > voldySpell.rank) {
    healthPoints.voldy = setWinnerPoints('voldy')
    healthPoints.player -= voldySpell.damage
    document.querySelector('#voldy-score').innerHTML = `Health Points: ${healthPoints.voldy}`
    document.querySelector('#player-score').innerHTML = `Health Points: ${healthPoints.player}`
    return 'Bad luck! Voldy beat you on that one!'
  }
}

function playerCastUnforgivableResult(playerSpell, voldySpell) {
  document.querySelector('#dark-magic-meter').innerHTML = `Dark Magic Meter: ${darkMagicMeter += 25}%`

  if (playerSpell.rank < voldySpell.rank) {
    healthPoints.player = setWinnerPoints('player')
    healthPoints.voldy -= playerSpell.damage
    document.querySelector('#player-score').innerHTML = `Health Points: ${healthPoints.player}`
    document.querySelector('#voldy-score').innerHTML = `Health Points: ${healthPoints.voldy}`
  }
  else {
    healthPoints.voldy = setWinnerPoints('voldy')
    healthPoints.player -= voldySpell.damage
    document.querySelector('#voldy-score').innerHTML = `Health Points: ${healthPoints.voldy}`
    document.querySelector('#player-score').innerHTML = `Health Points: ${healthPoints.player}`
  }

  return 'You cast an Unforgivable Curse! The Dark Magic Meter has gone up!'
}

function setWinnerPoints(winner) {
  return (++healthPoints[winner] > 7 ? 7 : healthPoints[winner])
}

function alertGameStatus(message) {
  let messageDiv = document.querySelector('#duel-round-message')

  if (voldySpell.name === 'Avada Kedavra') {
    activeDuel.win = false
    messageDiv.innerHTML = `
      <h2>Game Over! Voldy cast the killing curse on you. RIP.</h2>
      ${renderDuelOutcome()}
    `
    clearPreviousDuel()
    patchDuelOutcome()
  }
  else if (playerSpell.name === 'Avada Kedavra') {
    activeDuel.win = true
    messageDiv.innerHTML = `
      <h1>Game Over! Voldy is dead, but using the killing curse has compromised your soul.</h1>
      ${renderDuelOutcome()}
    `
    clearPreviousDuel()
    patchDuelOutcome()
  }
  else if (darkMagicMeter >= 100) {
    activeDuel.win = false
    messageDiv.innerHTML = `
      <h2> Game Over! The Dark Magic Meter has reached 100%. The wizarding world has been overtaken by Dark forces all thanks to you. </h2>
      ${renderDuelOutcome()}
    `
    clearPreviousDuel()
    patchDuelOutcome()
  }
  else if (healthPoints.player <= 0) {
    activeDuel.win = false
    messageDiv.innerHTML = `
      <h2> Game Over! Voldy has beaten you. Sry. </h2>
      ${renderDuelOutcome()}
    `
    clearPreviousDuel()
    patchDuelOutcome()
  }
  else if (healthPoints.voldy <= 0) {
    activeDuel.win = true
    messageDiv.innerHTML = `
      <h2> Game Over! You beat Voldy! Go celebrate with some butterbeer! </h2>
      ${renderDuelOutcome()}
    `
    clearPreviousDuel()
    patchDuelOutcome()
  }
  else {
    messageDiv.innerHTML = `<h2> ${message} </h2>`
  }
}

function patchDuelOutcome() {
  fetch(`http://localhost:3000/api/v1/duels/${activeDuel.id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({
      win: activeDuel.win
    })
  })
}

function renderDuelOutcome() {
  return `
    <h2> Final Duel Outcome: </h2>
    <h3> ${activeUser.username}: ${healthPoints.player} </h3>
    <h3> Voldy: ${healthPoints.voldy} </h3>
    <h3> Dark Magic Meter: ${darkMagicMeter} </h3>
    <button class='duel-button' data-id=${activeUser.id}> Start a New Duel </button>
  `
}

function clearPreviousDuel() {
  healthPoints.player = 7
  healthPoints.voldy = 7
  darkMagicMeter = 0

  document.querySelector('#player-score').innerHTML = `Health Points: ${healthPoints.player}`
  document.querySelector('#voldy-score').innerHTML = `Health Points: ${healthPoints.voldy}`
  document.querySelector('#dark-magic-meter').innerHTML = `Dark Magic Meter: ${darkMagicMeter}%`
}

// change threshhold of dark magic meter to be easier to max out
// add spell descriptions to buttons
// add funny messages about what happened during each round.
  // maybe just use whoever won and describe what their spell did to the other?
  // or pick randomly between the two
  // or describe both
// leaderboard
