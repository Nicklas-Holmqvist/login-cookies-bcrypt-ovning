const express = require('express');
const cookieSession = require('cookie-session')
const bcrypt = require('bcrypt')
const app = express()
const port = 3000

// databas
const users = []

// Make sure body is populated with json
app.use(express.json());

// Setup for cookies
app.use(cookieSession({
    name: 'session',
    secret: 'aVeryS3cr3tK3y',
    secure: false,
    maxAge: 1000*10,
    httpOnly: true
}))

// skapa användaren
app.post('/api/register', async (req, res) => {
    const { name, password } = req.body;

    // check if user already excist
    const userName = users.find(u => u.name === name);
    if( userName) {
        res.status(400).json('username already excist')
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log(hashedPassword)
    const user = {
        name,
        password: hashedPassword
    }
    users.push(user)
    res.status(201).json()
})

// logga in användaren
app.post('/api/login', async (req, res) => {
    const { name, password } = req.body;
    const user = users.find(u => u.name === name);
    console.log(user)

    // Check if usernamne and password is incorrect
    if(!user || !await bcrypt.compare(password, user.password)) {
        res.status(401).json('Incorrect password or username!');
        return
    }

    // Create session
    req.session.username = user.name;
    req.session.role = "admin"
    // req.session.role = 'admin'

    // Send response
    res.status(204).json(null)

})

// visa användare
app.get('/api/users', secureWithRole('admin'), (req, res) => {
    res.json(users)
})

// radera inlogningskaka
app.delete('/api/logout', (req, res) => {
    if(!req.session.username) {
        res.status(400).json('You are already logged out')
        return
    }
    req.session = null;
    res.status(402).json(null)
})

function secureWithRole(role) {
    return [secure,(req, res, next) => {
        if (req.session.role === role) {
            next()
        } else {
            res.status(403).json("Du får inte vara här! :)")
        }
    }]
}

// helper middleware for secure endpooints
function secure(req, res, next) {
    if (req.session.username) {
        next()
    } else {
        res.status(401).json("Du måste logga in")
    }
}


app.listen(port)