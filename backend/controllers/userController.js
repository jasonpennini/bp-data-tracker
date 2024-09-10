const { json } = require('express')
const User = require('../models/userModel')
const jwt = require('jsonwebtoken')
require('dotenv').config()

// id getting passed since it will be part of the payload
const createToken = (_id) => {
  return jwt.sign({_id}, process.env.SECRET, { expiresIn: '3d' })
}

// login user
const loginUser = async (req, res) => {
  // destructuring email and password from req body
  const {email, password} = req.body

  try {
    // using User model's login method and inserting the email and password from the request body as arguments into it
    // this will create an object user with the email and password form the request on the front end
    // taking the hashed password
    const user = await User.login(email, password)
    const token = createToken(user._id)
    return res.status(200).json({email, token})
  } catch (error) {
    // we could have a mongoose error here
    return res.status(400).json({error:error.message})
  }
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
    const token = createToken(user._id)
    return res.status(200).json({email, token})
  } catch (error) {
    // we could have a mongoose error here
    return res.status(400).json({error:error.message})
  }
}

module.exports = {loginUser, signupUser}