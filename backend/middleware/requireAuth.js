const jwt = require('jsonwebtoken')
const User = require('../models/userModel')

const requireAuth = async (req, res, next) => {
  // verify authentication
  // the json web token is on the authorization property of the request header
  // we can destructure off of it
 const { authorization } = req.headers
 // if there is no authorization token, return an error
  if(!authorization) {
    return res.status(401).json({error:"Authorization token required"})
  }
  if(authorization) {
    // this splits the authorization string and assigns the token constant to the element in index 1.
    const token = authorization.split(' ')[1]

    try {
      // verify token WITH THE verifty method, it will compare the two arguments to confirm they match
      // if the token matches the hidden code, we will pull the id from the payload
      const {_id} = jwt.verify(token, process.env.SECRET)

      // then we use the ID to try to find the user in the DB
      req.user = await User.findOne({_id}).select('_id')
      next()

    } catch(error) {
      console.log(error)
      return res.status(401).json({error:"Request is not authorized"})
    }
  }

  // authorization field will be a string but we only care about the unique id after bearer
  // 'Bearer df3ljkcvjixco90j3lljx'
}





module.exports = requireAuth