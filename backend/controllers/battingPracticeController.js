const BPWorkout = require('../models/bp-workouts')
const mongoose = require('mongoose')

// get all batting practices
const getAllBattingPractices = async (req, res) => {
  try { 
    const battingPractices = await BPWorkout.find({}).sort({createdAt:-1})
    res.status(200).json(battingPractices)
  } catch(error) {
    res.status(400).json({error: error.message})
  }
}

// get single batting practice
const getOneBattingPractice = async(req, res) => {
  try {
    const {id} = req.params
    if(!mongoose.Types.ObjectId.isValid(id)) {
      console.log('here')
      return res.status(404).json({error:"No such batting practice"})
    }
    const battingPractice = await BPWorkout.findById(id)
    res.status(200).json(battingPractice)
  } catch(error) {
    res.status(400).json({error:error.message})
  }
}

// create new bp
const createBattingPractice = async (req, res) => {
  const {player, bpType, date, maxEV, contactPercentage} = req.body
  try {
    // workout model tests the inputs that we destructured off the request body on the front end and creates an object 
    // if the inputs from the UI meet the criteria set in the Schema. If they do
    // the Workout model creates an object to send back to the front end and returns it in json format.
    // adds document to the DB in MongoDB too 
    const battingPractice = await BPWorkout.create({player, bpType, date, maxEV, contactPercentage})
    res.status(200).json(battingPractice)
  } catch(error) {
    res.status(400).json({error:error.message})
  }
}




// delete bp

// edit bp

module.exports = {
  createBattingPractice,
  getAllBattingPractices,
  getOneBattingPractice
}