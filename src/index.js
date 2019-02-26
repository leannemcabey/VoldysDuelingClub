const mainDiv = document.querySelector('#main_div')
const header = document.querySelector('#header')

///////////////////////////////////////////////////////////////////////////////

function showOrHideSignoutButton() {
  let buttonStyle = document.querySelector('#signout').style
  buttonStyle.display === 'none' ? buttonStyle.display = 'inline' : buttonStyle.display = 'none'
}

function renderWelcomeAndUserSignInForm() {
  mainDiv.innerHTML = `
    <div id="page-1-container" class="ui raised very padded text container segment">
      <p id='page-1-subheader' class="ui header">Welcome to Voldy's Dueling Club</p>
      <p>If you think you have what it takes to duel with Voldy, enter your username below.</p>
      <form class="ui form">
        <input type=text id='username' class="field"></input>
        <br></br>
        <input type=submit class="ui positive basic button"></input>
      </form>
    </div>
  `
  showOrHideSignoutButton()
}

function signIn() {
  showOrHideSignoutButton()
  mainDiv.innerHTML = renderRulesPage()
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
      <button class="ui positive basic button" data-action='duel-button' data-id='${activeUser.id}'>Begin Duel</button>
    </div>
  `
}

///////////////////////////////////////////////////////////////////////////////

renderWelcomeAndUserSignInForm()

///////////////////////////////////////////////////////////////////////////////

document.addEventListener('submit', event => {
  event.preventDefault()
  const username = document.querySelector('#username').value
  findOrCreateUser(username)
})

header.addEventListener('click', event => {
  if (event.target.id === 'signout') {
    activeUser = ''
    renderWelcomeAndUserSignInForm()
  }
})

document.addEventListener('click', event => {
  if (event.target.dataset.action === 'duel-button') {
    startDuel(event.target.dataset.id)
  }
})
