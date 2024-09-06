const User = require('../models/userModel')

// login user
const loginUser = async (req, res) => {
  return res.json({mssg:"login user"})
}

// signup user

const signupUser = async (req, res) => {
  return res.json({mssg:"signup user"})
}

module.exports = {loginUser, signupUser}