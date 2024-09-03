const express = require('express')
const Workout = require('../models/bp-workouts')

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

router.post('/', async (req, res) => {
  // destructures or pulls all these fields off the request body
  const {player, bpType, date, maxEV, contactPercentage} = req.body
  try {
    // workout model tests the inputs that we destructured off the request body on the front end and creates an object 
    // if the inputs from the UI meet the criteria set in the Schema. If they do
    // the Workout model creates an object to send back to the front end and returns it in json format. 
    const workout = await Workout.create({player, bpType, date, maxEV, contactPercentage})
    res.status(200).json(workout)
  }
  catch {
    res.status(400).json({error: error.message})
  }
})

router.patch('/:id', (req, res) => {
  res.json({mssg: 'Edit bp data entry'})
})

router.delete('/:id', (req, res) => {
  res.json({mssg: 'Delete bp data entry'})
})


module.exports = router