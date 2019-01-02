const mainDiv = document.querySelector('#main_div')

function renderWelcomeAndUserSignInForm() {
  mainDiv.innerHTML = `
    <div>
      <h3> Welcome to Voldy's Dueling Club, where [something witty about dying].</h3>
      <h4> If you think you have what it takes to duel with Voldy, enter your username below. </h4>
      <form>
        <input type=text id='username'> </input>
        <input type=submit> </input>
      </form>
    </div>
  `
}

renderWelcomeAndUserSignInForm()

document.addEventListener('submit', event => {
  event.preventDefault()
  const username = document.querySelector('#username').value
  findOrCreateUser(username)
})

document.addEventListener('click', event => {
  if (event.target.className === 'duel-button') {
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






// sign in page -- User.create() -- this should be find or create
// start duel button -- Duel.create()
// duel page with all spells visible as clickable buttons
// signout button that brings back up the sign in page
