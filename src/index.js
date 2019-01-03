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

renderWelcomeAndUserSignInForm()

document.addEventListener('submit', event => {
  event.preventDefault()
  const username = document.querySelector('#username').value
  findOrCreateUser(username)
})

document.addEventListener('click', event => {
  if (event.target.dataset.action === 'duel-button') {
    startDuel(event.target.dataset.id)
  }
  else if (event.target.className === 'spell-button') {
    returnedMessage = castSpell()
    alertGameStatus(returnedMessage)
  }
  else if (event.target.id === 'signout') {
    activeUser = ''
    document.querySelector('#header').innerHTML = `<h1> Voldy's Dueling Club </h1>`
    renderWelcomeAndUserSignInForm()
  }
})





// shuffle spells
// sign in page -- User.create() -- this should be find or create
// start duel button -- Duel.create()
// duel page with all spells visible as clickable buttons
// signout button that brings back up the sign in page
