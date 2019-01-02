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
      mainDiv.innerHTML = `
        <h2> As you wish, ${username}... </h2>
        <button id='duel-button' data-id='${activeUser.id}'> Begin Duel </button>
      `
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
        mainDiv.innerHTML = `
          <h2> As you wish, ${username}... </h2>
          <button id='duel-button' data-id='${activeUser.id}'> Begin Duel </button>
        `
      })
    }
  })
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
    playerCastUnforgivableResult(playerSpell, voldySpell)
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
  document.querySelector('#dark-magic-meter').innerHTML = `Dark Magic Meter: ${darkMagicMeter += 25}`

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
    messageDiv.innerHTML = `<h2>RIP. Voldy cast the killing curse on you. Game Over.</h2>`
    patchDuelOutcome()
  }
  else if (playerSpell.name === 'Avada Kedavra') {
    activeDuel.win = true
    messageDiv.innerHTML = `<h1>Voldy is dead, but using the killing curse has compromised your soul.</h1>`
    patchDuelOutcome()
  }
  else if (darkMagicMeter >= 100) {
    activeDuel.win = false
    messageDiv.innerHTML = `<h2> Game Over! The Dark Magic Meter has reached 100%. The wizarding world has been overtaken by Dark forces all thanks to you. </h2>`
    patchDuelOutcome()
  }
  else if (healthPoints.player <= 0) {
    activeDuel.win = false
    messageDiv.innerHTML = `<h2> Game Over! Voldy has beaten you. Sry. </h2>`
    patchDuelOutcome()
  }
  else if (healthPoints.voldy <= 0) {
    activeDuel.win = true
    messageDiv.innerHTML = `<h2> Game Over! You beat Voldy! Go celebrate with some butterbeer! </h2>`
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
    body: JSON.stringify(activeDuel)
  })
}

function clearPreviousDuel() {
  
}

// change threshhold of dark magic meter to be easier to max out
// add rules to page with begin duel button
  // if dark magic meter maxes out, the player loses
// add spell descriptions to buttons
// add funny messages about what happened during each round.
  // maybe just use whoever won and describe what their spell did to the other?
  // or pick randomly between the two
  // or describe both
// leaderboard
