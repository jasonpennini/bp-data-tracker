const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const validator = require('validator')

const Schema = mongoose.Schema

const userSchema = new Schema({
  email: {
    type:String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
})

// static signup method

// cannot be arrow function b/c we are using the 'this' keyword
userSchema.statics.signup = async function (email, password) {

  // validation
  if(!email || !password) {
    throw Error('Email and password must be filled')
  }

  // validtor has method that tests whether email is valid, we will input the email entered by the user
  // if not a valid email, throw an error
  if(!validator.isEmail(email)) { 
    throw Error('Email is not valid')
  }
  if (!validator.isStrongPassword(password)) {
    throw Error('Password must be at least 8 characters, contain one uppercase (A-Z) and lowercase letter (a-z), contain one digit (0-9) and one special character (!@#$%^&*()).')
  }

  // checking the DB for the email 
  const exists = await this.findOne({email})

  if(exists) {
    throw Error("The email already exists in DB")
  }
  // Brcypt is a hasing function that makes password in DB harder to crack
  // Brcypt users salt which randomizes a string to the user's password before it is hashed
  // mypassword930csdf32n09d
  // mypassword39x03mc920nd9

  // the number in genSalt will be home many times randomization occurs
  const salt = await bcrypt.genSalt(10)
  // two args are plain text password, and salt value
  const hash = await bcrypt.hash(password, salt)

  // creating a new document in this, which is the DB model, using the email and hashed password.
  const user = await this.create({email, password:hash})

  return user
}

userSchema.statics.login = async function (email, password) {

  if(!email || !password) {
    throw Error('Email and password must be filled')
  }

  // checking the DB for the email 
  const user = await this.findOne({email})

  if(!user) {
    throw Error('Incorrect login credential')
    }

    // this will compare the password input with the post request to the hashed password found in the db on the user object
    const match = await bcrypt.compare(password, user.password)
    if (!match) {
      throw Error('Incorrect login credentials')
    } 
    return user

  }

module.exports = mongoose.model('User', userSchema)