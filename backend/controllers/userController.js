const { json } = require('express')
const User = require('../models/userModel')

// login user
const loginUser = async (req, res) => {
  return res.json({mssg:"login user"})
}

// signup user
const signupUser = async (req, res) => {
  //destructuring off req body
  const {email, password} = req.body
  try {
    // using User model's signup method and inserting the email and password from the request body as arguments into it
    // this will create an object user with the email and password form the request on the front end
    // taking the hashed password

    const user = await User.signup(email, password)
    return res.status(200).json({email, user})

  } catch (error) {
    // we could have a mongoose error here
    return res.status(400).json({error:error.message})
  }
}

module.exports = {loginUser, signupUser}