let activeDuel
let healthPoints
let darkMagicMeter

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
  .then( result => result.json() )
  .then( parsedResult => {
    activeDuel = parsedResult
    healthPoints = {player: 7, voldy: 7}
    darkMagicMeter = 0
    const spellNames = getSpells().map( spell => `<button class='spell-button' data-id='${spell.rank}'> ${spell.name} </button>` ).join('')
    mainDiv.innerHTML = `
      <div data-id='duel-${parsedResult.id}'>
        <div id='duel-round-message'>
        </div>
        <div>
          <h4 id='dark-magic-meter'> Dark Magic Meter: ${darkMagicMeter} </h4>
        </div>
        <div id='spells'>
          ${spellNames}
        </div>
        <span id='player' data-id='${userId}'>
          <h3> ${activeUser.username} </h3>
          <h4 id='player-score'> Health Points: ${healthPoints.player} </h4>
          <img id='player-spell' src='images/questionmark.jpg' height=200px width=200px>
        </span>
        <span id='voldy'>
          <h3> Voldy </h3>
          <h4 id='voldy-score'> Health Points: ${healthPoints.voldy} </h4>
          <img id='voldy-spell' src='images/questionmark.jpg' height=200px width=200px>
        </span>
      </div>
    `
  })
}

function getSpells() {
  return [
      {rank: 1, damage: 7, name: "Avada Kedavra", description: "Instantly kills the opponent"},
      {rank: 2, damage: 3, name: "Crucio", description: "Causes the opponent agonizing pain"},
      {rank: 3, damage: 3, name: "Imperio", description: "Allows you to control the opponent's actions"},
      {rank: 4, damage: 2, name: "Protego", description: "A shield charm that can fend off spells"},
      {rank: 5, damage: 2, name: "Expelliarmus", description: "Removes the wand from the opponent’s hand"},
      {rank: 6, damage: 2, name: "Sectumsempra", description: "Slices the opponent, as if they are being cut by an invisible sword"},
      {rank: 7, damage: 1, name: "Stupefy", description: "Stuns the opponent, rendering them unconscious"},
      {rank: 8, damage: 1, name: "Petrificus Totalus", description: "Full body binding curse"},
      {rank: 9, damage: 1, name: "Locomotor Mortis", description: "Binds the legs of the opponent together"},
      {rank: 10, damage: 1, name: "Incarcerous", description: "Conjures thick ropes that are used to bind the opponent"},
      {rank: 11, damage: 1, name: "Impedimenta", description: "Stops or slows down the opponent by temporarily immobilizing them"},
      {rank: 12, damage: 1, name: "Confundo", description: "Causes confusion in the opponent"},
      {rank: 13, damage: 1, name: "Levicorpus", description: "Causes the opponent to hand upside-down in midair as if hoisted by the ankle"}
  ]
}
