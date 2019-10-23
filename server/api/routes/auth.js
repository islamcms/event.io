require('dotenv').config()
const router = require('express').Router()
const bcrypt = require('bcrypt')
const db = require('../models')
const jwt = require('jsonwebtoken')

function unauthorized(res) {
  res.status(401).json({ message: 'Unauthorized' })
}

router.post('/login', async (req, res) => {
  const { email, password } = req.body
  const user = await db.User.findOne({ email })
  if (!user) return unauthorized(res)
  bcrypt.compare(password, user.password, (err, same) => {
    if (err || !same) return unauthorized(res)
    const payload = {
      username: user.username,
      email: user.email,
      uid: user._id
    }
    const token = jwt.sign(payload, process.env.API_KEY, {
      expiresIn: '1h'
    })
    res.json({ token })
  })
})

router.post('/register', async (req, res) => {
  const { email, password, username } = req.body
  const userExists = await db.User.findOne({ email })
  if (userExists) {
    return res.json({ message: 'Email has already been registered' })
  }
  bcrypt.hash(password, 10, async (err, hash) => {
    if (err) {
      return res.status(400).json(err)
    } else {
      try {
        const user = await db.User.create({ username, email, password: hash })
        res.json({ message: 'User created' })
      } catch (err) {
        res.status(400).json(err)
      }
    }
  })
})

module.exports = router