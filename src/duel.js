let activeDuel
let healthPoints
let darkMagicMeter
let clicked = false

///////////////////////////////////////////////////////////////////////////////

function getSpells() {
  return [
    {rank: 12, damage: 1, name: "Confundo", description: "Causes confusion in the opponent"},
    {rank: 3, damage: 3, name: "Imperio", description: "Allows you to control the opponent's actions"},
    {rank: 8, damage: 1, name: "Petrificus Totalus", description: "Full body binding curse"},
    {rank: 5, damage: 2, name: "Expelliarmus", description: "Removes the wand from the opponent’s hand"},
    {rank: 13, damage: 1, name: "Levicorpus", description: "Causes the opponent to hang upside-down in midair as if hoisted by the ankle"},
    {rank: 6, damage: 2, name: "Sectumsempra", description: "Slices the opponent, as if they are being cut by an invisible sword"},
    {rank: 1, damage: 7, name: "Avada Kedavra", description: "Instantly kills the opponent"},
    {rank: 7, damage: 1, name: "Stupefy", description: "Stuns the opponent, rendering them unconscious"},
    {rank: 4, damage: 2, name: "Protego", description: "A shield charm that can fend off spells"},
    {rank: 10, damage: 1, name: "Incarcerous", description: "Conjures thick ropes that are used to bind the opponent"},
    {rank: 11, damage: 1, name: "Impedimenta", description: "Stops or slows down the opponent by temporarily immobilizing them"},
    {rank: 2, damage: 3, name: "Crucio", description: "Causes the opponent agonizing pain"},
    {rank: 9, damage: 1, name: "Locomotor Mortis", description: "Binds the legs of the opponent together"}
  ]
}

function renderSpellList() {
  return getSpells().map(spell => {
    return `
      <div>
        <button class='ui grey button spells' id='spell-${spell.rank}' data-action='spell-button' data-id='${spell.rank}'> ${spell.name}
          <i id='info' class='info circle icon' data-id='${spell.rank}'></i>
        </button>
        <p class='spell-par' id='spellinfo-${spell.rank}'><p>
      </div>
    `}).join('')
}

function setStartingDuelStats() {
  healthPoints = {player: 7, voldy: 7}
  darkMagicMeter = 0
}

function renderDuelPage(duelId, userId) {
  return `
    <div data-id='duel-${duelId}'>
      <div id='duel-round-message'>
        Choose a spell below.
      </div>
      <div class='ui horizontal divider'>
        <h4 id='dark-magic-meter' class='ui medium header'> Dark Magic Meter<i class='thermometer empty icon'></i>${darkMagicMeter}%</h4>
      </div>
      <div id='dimmer-div'>
        <div class='ui grid'>
          <div id='leaderboard' class='four wide column ui medium header'>
            <p>Leaderboard:</p>
            <ul>
              ${leaderboard}
            <ul>
          </div>
          <div id='spells' class='four wide column'>
            ${renderSpellList()}
          </div>
          <div id='player' class='four wide column' data-id='${userId}'>
            <h4 id='player-score' class='ui large header'><i class='heartbeat icon'></i> ${healthPoints.player}</h4>
            <h3 class='ui large header' id='player-name'>${activeUser.username}</h3>
            <div id='player-spell' class='image-blurred-edge'></div>
          </div>
          <div id='voldy' class='four wide column'>
            <h4 id='voldy-score' class='ui large header'><i class='heartbeat icon'></i> ${healthPoints.voldy}</h4>
            <h3 class='ui large header' id='voldy-name'>Voldy</h3>
            <div id='voldy-spell' class='image-blurred-edge'></div>
          </div>
        </div>
      </div>
    </div>
  `
}

function makeSpellButtonGreen(elementId) {
  document.querySelector(elementId).setAttribute('class', 'ui green button spells')
}

function startDuel(userId) {
  fetch('http://localhost:3000/api/v1/duels', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({
      user_id: userId
    })
  })
  .then(result => result.json())
  .then(parsedResult => {
    activeDuel = parsedResult
    setStartingDuelStats()
    mainDiv.innerHTML = renderDuelPage(parsedResult.id, userId)
    let unforgivableSpellButtons = ['#spell-1', '#spell-2', '#spell-3']
    unforgivableSpellButtons.forEach(elementId => makeSpellButtonGreen(elementId))
  })
}

function chooseMeterIcon() {
  let meterIcon
  if (darkMagicMeter === 100) {
    meterIcon = `<i class='thermometer full icon'></i>`
  }
  else if (darkMagicMeter === 50) {
    meterIcon = `<i class='thermometer half icon'></i>`
  }
  else {
    meterIcon = `<i class='thermometer empty icon'></i>`
  }
  return meterIcon
}

function renderDuelOutcome() {
  return `
    <p id='outcome-title'><i class='magic icon'></i>Final Duel Outcome:</p>
    <p>${activeUser.username} <i class='heartbeat icon'></i> ${healthPoints.player}</p>
    <p>Voldy <i class='heartbeat icon'></i> ${healthPoints.voldy}</p>
    <p>Dark Magic Meter${chooseMeterIcon()}${darkMagicMeter}%</p>
    <button class='ui positive basic button' data-action='duel-button' data-id=${activeUser.id}>Start a New Duel</button>
  `
}

function clearPreviousDuel() {
  setStartingDuelStats()
  document.querySelector('#player-score').innerHTML = `<i class='heartbeat icon'></i> ${healthPoints.player}`
  document.querySelector('#voldy-score').innerHTML = `<i class='heartbeat icon'></i> ${healthPoints.voldy}`
  document.querySelector('#dark-magic-meter').innerHTML = `Dark Magic Meter<i class='thermometer empty icon'></i>${darkMagicMeter}%`
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
  }).then(renderLeaderboard)
}

function endDuel() {
  let messageDiv = document.querySelector('#duel-round-message')
  messageDiv.innerHTML = `${renderDuelOutcome()}`
  window.scrollTo(0,0)
  document.querySelector('#dimmer-div').setAttribute('class','dimmer')
  document.querySelector('#dark-magic-meter').setAttribute('class','dimmer')
  clearPreviousDuel()
  patchDuelOutcome()
}
