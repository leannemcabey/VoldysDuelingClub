const mainDiv = document.querySelector('#main_div')

function renderWelcomeAndUserSignInForm() {
  mainDiv.innerHTML = `
    <div id="page-1-container" class="ui raised very padded text container segment">
      <p id='page-1-subheader' class="ui header"> Welcome to Voldy's Dueling Club, the happiest place on Earth.</p>
      <p> If you think you have what it takes to duel with Voldy, enter your username below. </p>
      <form class="ui form">
        <input type=text id='username' class="field"> </input>
        <input type=submit class="ui positive basic button"> </input>
      </form>
    </div>
  `
  document.querySelector('#signout').style.display = 'none'
}

function renderRulesPage() {
  return `
    <div class="ui raised very padded text container segment">
      <h2> As you wish, ${activeUser.username}... </h2>
      <h4>
        <p>
          The rules are simple. You and Voldy will each cast a spell.
          Whoever's spell is trumped by the other will lose the number of
          Health Points equal to the damage of the winning spell. Whoever runs out
          of Health Points first loses.
        </p>
        <p>
          But beware of casting Unforgivable Curses. The Dark Magic Meter will
          increase each time you do. If it reaches 100%, you have sent the wizarding
          world into a terrible, dark place, the game is over, and you lose. If either
          of you cast the Killing Curse, your duel will be short lived, and so
          will your opponent. Have fun!
        </p>
      </h4>
      <button class="ui positive basic button" data-action='duel-button' data-id='${activeUser.id}'> Begin Duel </button>
    </div>
  `
}

function renderLeaderboard() {
  fetch('http://localhost:3000/api/v1/users')
  .then( result => result.json() )
  .then( parsedResult => {
    let sortedResult = parsedResult.sort(compareWins).reverse()
    // let topFive = sortedResult.slice(0,5)
    wins = sortedResult.map( user => {
      return `<li> <i class="user outline icon"></i> ${user.username} -- ${getWins(user)} Wins </li>`
    }).join('')
    return wins
  })
}

renderWelcomeAndUserSignInForm()
renderLeaderboard()

document.addEventListener('submit', event => {
  event.preventDefault()
  const username = document.querySelector('#username').value
  findOrCreateUser(username)
})

document.addEventListener('click', event => {
  if (event.target.dataset.action === 'duel-button') {
    startDuel(event.target.dataset.id)
  }
  else if (event.target.dataset.action === 'spell-button') {
    returnedMessage = castSpell()
    alertGameStatus(returnedMessage)
    showSpell()
  }
  else if (event.target.id === 'signout') {
    activeUser = ''
    renderWelcomeAndUserSignInForm()
  }
})
