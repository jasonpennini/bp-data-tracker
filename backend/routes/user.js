const express = require('express')
// 
const {signupUser, loginUser} = require('../controllers/userController')

//creating an instance of express router
const router = express.Router()

// signup route
router.post('/login', loginUser)

// login route
router.post('/signup', signupUser)

module.exports = router