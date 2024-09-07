const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

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
  }
})

// static signup method

// cannot be arrow function b/c we are using the 'this' keyword
userSchema.statics.signup = async function (email, password) {
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

module.exports = mongoose.model('User', userSchema)