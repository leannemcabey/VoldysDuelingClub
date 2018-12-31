function findOrCreateUser(username) {
  fetch('http://localhost:3000/api/v1/users')
  .then( result => result.json() )
  .then( parsedResult => {
    const usernames = parsedResult.map( user => user.username )
    if (usernames.includes(username)) {
      let activeUser = parsedResult.find( user => user.username === username )
      return activeUser
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
        return activeUser
      })
    }
  })
}

function startDuel(activeUser) {
  fetch('http://localhost:3000/api/v1/duels', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({
      user_id: activeUser.id
    })
  })
  .then( result => result.json() )
  .then( console.log )
}
