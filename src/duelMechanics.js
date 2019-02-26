let playerSpell
let voldySpell
const unforgivables = ['Avada Kedavra', 'Crucio', 'Imperio']
const topTier = getSpells().filter(spell => spell.damage > 2) // AKA The Unforgivable Curses
const middleTier = getSpells().filter(spell => spell.damage === 2)
const bottomTier = getSpells().filter(spell => spell.damage === 1)

///////////////////////////////////////////////////////////////////////////////
// VOLDY'S SPELL MECHANICS

function randomTopTierSpell() {
  return topTier[Math.floor(Math.random() * topTier.length)]
}

function randomMiddleTierSpell() {
  return middleTier[Math.floor(Math.random() * middleTier.length)]
}

function randomBottomTierSpell() {
  return bottomTier[Math.floor(Math.random() * bottomTier.length)]
}

function castDangerZoneSpell(chance) {
  /* When Voldy's HP is lower than 3, there is a ~10% chance he will cast a bottom tier spell,
  ~10% chance he will cast a middle tier spell, and a ~80% chance he will cast a top tier spell.
  He's not messin' around. */
  if (chance < 10) {
    return randomBottomTierSpell()
  }
  else if (chance < 20) {
    return randomMiddleTierSpell()
  }
  else {
    return randomTopTierSpell()
  }
}

function castWeakenedZoneSpell(chance) {
  /* When Voldy's HP is lower than 6, there is a ~30% chance he will cast a bottom tier spell,
  ~50% chance he will cast a middle tier spell, and a ~20% chance he will cast a top tier spell. */
  if (chance < 30) {
    return randomBottomTierSpell()
  }
  else if (chance < 80) {
    return randomMiddleTierSpell()
  }
  else {
    return randomTopTierSpell()
  }
}

function castHealthyZoneSpell(chance) {
  /* When Voldy's HP is above 6, there is a ~45% chance he will cast a bottom tier spell,
  ~45% chance he will cast a middle tier spell, and ~10% chance he will cast a top tier spell.
  It wouldn't be very fun for him if he just killed you right off the bat. */
  if (chance < 45) {
    return randomBottomTierSpell()
  }
  else if (chance < 90) {
    return randomMiddleTierSpell()
  }
  else {
    return randomTopTierSpell()
  }
}

function voldyCastSpell() {
  let chance = Math.ceil(Math.random() * 100)
  if (healthPoints.voldy < 3) {
    return castDangerZoneSpell(chance)
  }
  else if (healthPoints.voldy < 6) {
    return castWeakenedZoneSpell(chance)
  }
  else {
    return castHealthyZoneSpell(chance)
  }
}

///////////////////////////////////////////////////////////////////////////////
// DUEL MECHANICS

function showOrHideSpellInfo(eventTarget) {
  clicked = !clicked
  let targetedSpell = getSpells().find(spell => spell.rank == eventTarget.dataset.id)
  let targetedPTag = document.querySelector(`#spellinfo-${eventTarget.dataset.id}`)
  clicked ? targetedPTag.innerHTML += `${targetedSpell.description}` : targetedPTag.innerHTML = ''
}

function showSpell() {
  document.querySelector('#player-spell').innerHTML = `<div class='cast-spell-name'> ${playerSpell.name} </div>`
  document.querySelector('#voldy-spell').innerHTML = `<div class='cast-spell-name'> ${voldySpell.name} </div>`
}

function setPoints(winner, loser, damage) {
  healthPoints[winner] = ++healthPoints[winner] > 7 ? 7 : healthPoints[winner]
  healthPoints[loser] = (healthPoints[loser] -= damage) < 0 ? 0 : healthPoints[loser]
  document.querySelector('#player-score').innerHTML = `<i class="heartbeat icon"></i>${healthPoints.player}`
  document.querySelector('#voldy-score').innerHTML = `<i class="heartbeat icon"></i> ${healthPoints.voldy}`
}

function increaseDarkMagicMeter(increaseAmount) {
  darkMagicMeter += increaseAmount
  document.querySelector('#dark-magic-meter').innerHTML = `Dark Magic Meter${chooseMeterIcon()}</i>${darkMagicMeter}%`
}

function castSpells() {
  playerSpell = getSpells().find(spell => spell.rank == event.target.dataset.id)
  voldySpell = voldyCastSpell()

  if (playerSpell.name === voldySpell.name) {
    return 'You and Voldy cast the same spell! No Health Points have been lost.'
  }
  else if (voldySpell.name === 'Avada Kedavra') {
    setPoints('voldy', 'player', voldySpell.damage)
    return 'Game Over! Voldy cast the killing curse on you. RIP.'
  }
  else if (playerSpell.name === 'Avada Kedavra') {
    increaseDarkMagicMeter(100)
    setPoints('player', 'voldy', playerSpell.damage)
    return 'Game Over! Voldy is dead, but using the killing curse has compromised your soul.'
  }
  else if (unforgivables.includes(playerSpell.name)) {
    increaseDarkMagicMeter(50)
    if (playerSpell.rank < voldySpell.rank) {
      setPoints('player', 'voldy', playerSpell.damage)
    }
    else {
      setPoints('voldy', 'player', voldySpell.damage)
    }
    return 'You cast an Unforgivable Curse! The Dark Magic Meter has gone up!'
  }
  else if (playerSpell.rank < voldySpell.rank) {
    setPoints('player', 'voldy', playerSpell.damage)
    return "Nice one! Your spell beat Voldy's!"
  }
  else if (playerSpell.rank > voldySpell.rank) {
    setPoints('voldy', 'player', voldySpell.damage)
    return 'Bad luck! Voldy beat you on that one!'
  }
}

function alertGameStatus(message) {
  if (voldySpell.name === 'Avada Kedavra') {
    activeDuel.win = false
    setTimeout(() => alert(message), 1000)
    setTimeout(endDuel, 1000)
  }
  else if (playerSpell.name === 'Avada Kedavra') {
    activeDuel.win = true
    setTimeout(() => alert(message), 1000)
    setTimeout(endDuel, 1000)
  }
  else if (darkMagicMeter >= 100) {
    activeDuel.win = false
    setTimeout(() => alert('Game Over! The Dark Magic Meter has reached 100%. The wizarding world has been overtaken by Dark forces all thanks to you.'), 1000)
    setTimeout(endDuel, 1000)
  }
  else if (healthPoints.player <= 0) {
    activeDuel.win = false
    setTimeout(() => alert('Game Over! Voldy has won. Sorry.'), 1000)
    setTimeout(endDuel, 1000)
  }
  else if (healthPoints.voldy <= 0) {
    activeDuel.win = true
    setTimeout(() => alert('Game Over! You beat Voldy! Go celebrate with some butterbeer!'), 1000)
    setTimeout(endDuel, 1000)
  }
  else {
    setTimeout(() => alert(message), 1000)
  }
}

///////////////////////////////////////////////////////////////////////////////

document.addEventListener('click', event => {
  if (event.target.dataset.action === 'spell-button') {
    alertGameStatus(castSpells())
    showSpell()
  }
  else if (event.target.id === 'info') {
    showOrHideSpellInfo(event.target)
  }
})
