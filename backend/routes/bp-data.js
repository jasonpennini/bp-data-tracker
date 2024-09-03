const express = require('express')

//creates an instance of express router which we must first require in
const router = express.Router()

// route handler will handle get requests to local host 4000/ 
// will send a request to the server and a response back to the front end, the req/res objects allow us to persist data
router.get('/', (req, res) => {
  // we are sending a response object back to front end with a message
  res.json({mssg:'Get all bp data entries'})
})

router.get('/:id', (req, res) => {
  res.json({mssg: 'Get single bp data entry'})
})

router.post('/', (req, res) => {
  res.json({mssg: 'Create bp data entry'})
})

router.patch('/:id', (req, res) => {
  res.json({mssg: 'Edit bp data entry'})
})

router.delete('/:id', (req, res) => {
  res.json({mssg: 'Delete bp data entry'})
})


module.exports = router