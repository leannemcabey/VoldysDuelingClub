let activeUser

///////////////////////////////////////////////////////////////////////////////

function findOrCreateUser(username) {
  fetch('http://localhost:3000/api/v1/users')
  .then(result => result.json())
  .then(parsedResult => {
    const usernames = parsedResult.map(user => user.username)
    if (usernames.includes(username)) {
      activeUser = parsedResult.find(user => user.username === username)
      signIn()
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
      .then(result => result.json())
      .then(parsedResult => {
        activeUser = parsedResult
        signIn()
      })
    }
  })
}
