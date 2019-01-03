let activeUser
let playerSpell
let voldySpell
let wins

function findOrCreateUser(username) {
  fetch('http://localhost:3000/api/v1/users')
  .then( result => result.json() )
  .then( parsedResult => {
    const usernames = parsedResult.map( user => user.username )
    if (usernames.includes(username)) {
      activeUser = parsedResult.find( user => user.username === username )
      document.querySelector('#signout').style.display = 'inline'
      // document.querySelector('#header').innerHTML += `<button class="ui positive basic button" id='signout'> Sign Out </button>`
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
    healthPoints.player = setLoserPoints('player', voldySpell.damage)
    document.querySelector('#player-score').innerHTML = `<i class="heartbeat icon"></i> ${healthPoints.player}`
    return ''
  }
  else if (playerSpell.name === 'Avada Kedavra') {
    darkMagicMeter = '100%'
    healthPoints.player = 0
    healthPoints.voldy = setLoserPoints('voldy', playerSpell.damage)
    document.querySelector('#voldy-score').innerHTML = `<i class="heartbeat icon"></i> ${healthPoints.voldy}`
    document.querySelector('#player-score').innerHTML = `<i class="heartbeat icon"></i> ${healthPoints.player}`
    return ''
  }
  else if (unforgivables.includes(playerSpell.name)) {
    return playerCastUnforgivableResult(playerSpell, voldySpell)
  }
  else if (playerSpell.rank < voldySpell.rank) {
    healthPoints.player = setWinnerPoints('player')
    // healthPoints.voldy -= playerSpell.damage
    healthPoints.voldy = setLoserPoints('voldy', playerSpell.damage)
    document.querySelector('#player-score').innerHTML = `<i class="heartbeat icon"></i> ${healthPoints.player}`
    document.querySelector('#voldy-score').innerHTML = `<i class="heartbeat icon"></i> ${healthPoints.voldy}`
    return 'Nice one! You beat Voldy!'
  }
  else if (playerSpell.rank > voldySpell.rank) {
    healthPoints.voldy = setWinnerPoints('voldy')
    // healthPoints.player -= voldySpell.damage
    healthPoints.player = setLoserPoints('player', voldySpell.damage)
    document.querySelector('#voldy-score').innerHTML = `<i class="heartbeat icon"></i> ${healthPoints.voldy}`
    document.querySelector('#player-score').innerHTML = `<i class="heartbeat icon"></i>

     ${healthPoints.player}`
    return 'Bad luck! Voldy beat you on that one!'
  }
}

function playerCastUnforgivableResult(playerSpell, voldySpell) {
  document.querySelector('#dark-magic-meter').innerHTML = `Dark Magic Meter<i class="thermometer half icon"></i>${darkMagicMeter += 25}%`

  if (playerSpell.rank < voldySpell.rank) {
    healthPoints.player = setWinnerPoints('player')
    // healthPoints.voldy -= playerSpell.damage
    healthPoints.voldy = setLoserPoints('voldy', playerSpell.damage)
    document.querySelector('#player-score').innerHTML = `<i class="heartbeat icon"></i> ${healthPoints.player}`
    document.querySelector('#voldy-score').innerHTML = `<i class="heartbeat icon"></i> ${healthPoints.voldy}`
  }
  else {
    healthPoints.voldy = setWinnerPoints('voldy')
    // healthPoints.player -= voldySpell.damage
    healthPoints.player = setLoserPoints('player', voldySpell.damage)
    document.querySelector('#voldy-score').innerHTML = `<i class="heartbeat icon"></i> ${healthPoints.voldy}`
    document.querySelector('#player-score').innerHTML = `<i class="heartbeat icon"></i> ${healthPoints.player}`
  }
  return 'You cast an Unforgivable Curse! The Dark Magic Meter has gone up!'
}

function setWinnerPoints(winner) {
  return (++healthPoints[winner] > 7 ? 7 : healthPoints[winner])
}

function setLoserPoints(loser, damage) {
  return ((healthPoints[loser] -= damage) < 0 ? 0 : healthPoints[loser])
}

function getWins(user) {
  return user.duels.filter( duel => duel.win === true ).length
}

function compareWins(a,b) {
  if (getWins(a) < getWins(b))
     return -1
  if (getWins(a) > getWins(b))
    return 1
  return 0
}

// change threshhold of dark magic meter to be easier to max out
// add spell descriptions to buttons
