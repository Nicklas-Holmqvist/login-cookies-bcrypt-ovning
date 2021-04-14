const express = require('express');
const app = express()
const port = 3000

// databas
const users = [{
    name: 'Nicklas',
    password: 123456
}]

app.use(express.json());

// skapa användaren
app.post('/api/register', (req, res) => {

})

// logga in användaren
app.post('/api/login', (req, res) => {

})

// visa användare
app.get('/api/users', (req, res) => {

})

// radera inlogningskaka
app.delete('/api/logout', (req, res) => {

})


app.listen(port)