// we must require in the .dotenv file and invoke config method, 
// which adds .env file variables to a project, so we can keep port number hidden
require('dotenv').config()
// after running npm i express 
const express = require('express')

// we can create an instance of express  
const app = express()

// adding middleware, which is any function that executes between request and response
// we will never advance to next piece of middleware without next

app.use((req, res, next) => {
  // this will log all requests that occur before response to front end
  console.log(req.path, req.method)
  return next()
})

// route handler will handle get requests to local host 4000/ 
// will send a request to the server and a response back to the front end, the req/res objects allow us to persist data
app.get('/', (req, res) => {
  // we are sending a response object back to front end with a message
  res.json({mssg:'Welcome to the app'})
})

const port = process.env.PORT

// express instance has a listen method which listens for a specific port and executes the anonymous function
app.listen(port, () => {
  console.log(`listening on port ${port}`)
})

//nodemon watches our files and re-runs the application whenever a chance is made
