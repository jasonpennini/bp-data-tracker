const BPWorkout = require('../models/bp-workouts')
const mongoose = require('mongoose')
const User = require('../models/userModel')

// get all batting practices
const getAllBattingPractices = async (req, res) => {
  try { 
    const user_id = req.user.id
    // search the User Model for the current user
    const user = await User.findById(user_id)
    // the current user is an Admin, return all BP
    if(user.isAdmin===true) {
      const battingPractices = await BPWorkout.find({}).sort({createdAt:-1})
      return res.status(200).json(battingPractices)
    }
    const battingPractices = await BPWorkout.find({user_id}).sort({createdAt:-1})
    return res.status(200).json(battingPractices)
  } catch(error) {
    return res.status(400).json({error: error.message})
  }
}

// get single batting practice
const getOneBattingPractice = async(req, res) => {
  try {
    const {id} = req.params
    if(!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({error:"No such batting practice"})
    }
    const battingPractice = await BPWorkout.findById(id)
    return res.status(200).json(battingPractice)
  } catch(error) {
    return res.status(400).json({error:error.message})
  }
}

// create new bp
const createBattingPractice = async (req, res) => {
  // we know req.user exists since we will never hit this line of code without passing through the autorization middlware first
  const user_id = req.user._id

  const {player, bpType, date, maxEV, contactPercentage} = req.body

  let errorFields = []
  const inputDate = new Date(date);
  const today = new Date()
  const validMaxEV = maxEV => 0 && maxEV <= 130;
  const validContactPCT = contactPercentage => 0 && contactPercentage <= 100
  
  if(!player) {
    errorFields.push('Player')
  }
  if(!bpType) {
    errorFields.push('BP Type')
  }  
  if(!date || inputDate > today) {
    errorFields.push('Date')
  }
  if(!maxEV || !validMaxEV) {
    errorFields.push('Max EV')
  }
  if(!contactPercentage || !validContactPCT) {
    errorFields.push('Contact Percentage')
  }

  if(errorFields.length>0) {
    return res.status(400).json({error: `Please fill in all fields with valid values: ${errorFields}`, errorFields})
  }

  try {
    // workout model tests the inputs that we destructured off the request body on the front end and creates an object 
    // if the inputs from the UI meet the criteria set in the Schema. If they do
    // the Workout model creates an object to send back to the front end and returns it in json format.
    // adds document to the DB in MongoDB too 
    const battingPractice = await BPWorkout.create({player, bpType, date, maxEV, contactPercentage, user_id})
    return res.status(200).json(battingPractice)
  } catch(error) {
    return res.status(400).json({error:error.message})
  }
}

// delete bp
const deleteBattingPractice = async (req, res) => {
  const { id } = req.params

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({error: 'No such workout'})
  }
  const battingPractice = await BPWorkout.findOneAndDelete({_id: id})

  if (!battingPractice) {
    return res.status(400).json({error: 'No such workout'})
  }
  res.status(200).json(battingPractice)
}
 

// edit bp
const updateBattingPracitce = async (req, res) => {
  try {
    const {id} = req.params
    if(!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({error:"No such batting practice"})
    }

    const battingPractice = await BPWorkout.findOneAndUpdate({_id:id}, {
      ...req.body
    })
    return res.status(200).json(battingPractice)
  } catch(error) {
    return res.status(400).json({error:error})
  }
}

module.exports = {
  createBattingPractice,
  getAllBattingPractices,
  getOneBattingPractice, 
  updateBattingPracitce,
  deleteBattingPractice
}