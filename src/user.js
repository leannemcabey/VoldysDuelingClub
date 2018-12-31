
function findOrCreateUser(username) {
  fetch('http://localhost:3000/api/v1/users')
  .then( result => result.json() )
  .then( parsedResult => {
    const usernames = parsedResult.map( user => user.username )
    if (usernames.includes(username)) {
      let activeUser = parsedResult.find( user => user.username === username )
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
        let activeUser = parsedResult
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
  let playerSpell = spells.find( spell => spell.rank == event.target.dataset.id )
  let voldySpell = spells[Math.floor(Math.random() * spells.length)];
  console.log(playerSpell, voldySpell)

  if (unforgivables.includes(voldySpell.name)) {
    if (playerSpell.rank > voldySpell.rank) {
      document.querySelector('#dark-magic-meter').innerHTML = `Dark Magic Meter: ${darkMagicMeter += 20}`
      scores.player = 0
      document.querySelector('#player-score').innerHTML = `Score: ${scores.player}`
      document.querySelector('#voldy-score').innerHTML = `Score: ${++scores.voldy}`
        alertGameStatus('Voldy cast an Unforgivable Curse! The Dark Magic Meter has gone up and you lost all your points!')
    }
    else {
      document.querySelector('#dark-magic-meter').innerHTML = `Dark Magic Meter: ${darkMagicMeter += 20}`
      scores.player = 0
      document.querySelector('#player-score').innerHTML = `Score: ${scores.player}`
      alertGameStatus('Voldy cast an Unforgivable Curse! The Dark Magic Meter has gone up and you lost all your points!')
    }
  }
  else if (playerSpell.rank < voldySpell.rank) {
    if (unforgivables.includes(playerSpell.name)) {
      document.querySelector('#dark-magic-meter').innerHTML = `Dark Magic Meter: ${darkMagicMeter += 20}`
      document.querySelector('#player-score').innerHTML = `Score: ${++scores.player}`
      alertGameStatus('You cast an Unforgivable Curse! The Dark Magic Meter has gone up!')
    }
    else {
      document.querySelector('#player-score').innerHTML = `Score: ${++scores.player}`
      alertGameStatus('Nice one! You beat Voldy!')
    }
  }
  else if (playerSpell.rank > voldySpell.rank) {
    document.querySelector('#voldy-score').innerHTML = `Score: ${++scores.voldy}`
    alertGameStatus('Bad luck! Voldy beat you on that one!')
  }
}

function alertGameStatus(message) {
  if (darkMagicMeter >= 100) {
    alert('Game Over! The Dark Magic Meter has reached 100%. The wizarding world has been overtaken by Dark forces.')
  }
  else if (scores.player >= 7 || scores.voldy >= 7) {
    alert('Game Over!')
  }
  else {
    alert(message)
  }
}

// if same spell is cast
// leaderboard
// add rules to page with begin duel button
