const BPWorkout = require('../models/bp-workouts')
const mongoose = require('mongoose')
const User = require('../models/userModel')

// get all batting practices
const getAllBattingPractices = async (req, res) => {

  console.log(`fetching all bps ${req}`)
 // Extract query parameters from the request
 const { player, bpType, startDate, endDate } = req.query;

// Define an empty filter object
let filter = {};

if (player && bpType && startDate && endDate) {
  filter.player = player;
  filter.bpType = bpType;
  filter.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
}
  try { 
    const user_id = req.user.id
    // search the User Model for the current user
    const user = await User.findById(user_id)
    // the current user is an Admin, return all BP
    if(user.isAdmin===true) {
      const battingPractices = await BPWorkout.find(filter).sort({createdAt:-1})
      return res.status(200).json(battingPractices)
    }
    const battingPractices = await BPWorkout.find({user_id}).sort({createdAt:-1})
    return res.status(200).json(battingPractices)
  } catch(error) {
    res.status(500).json({ error: 'Failed to fetch BP Entries.' });
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

  const {player, bpType, date, exitSpeed, angle, direction, distance, autoPitchType } = req.body

  let errorFields = []
  const inputDate = new Date(date);
  const today = new Date()
  const validExitSpeed = exitSpeed => 0 && exitSpeed <= 130;
  const validAngle = angle => -180 && angle <= 180
  const validDirection = direction => -180 && direction <= 180
  const validDistance = distance => 0 && distance <= 600

  if(!player) {
    errorFields.push('Player')
  }
  if(!bpType) {
    errorFields.push('BP Type')
  }  
  if(!date || inputDate > today) {
    errorFields.push('Date')
  }
  if(!exitSpeed || !validExitSpeed) {
    errorFields.push('Exit Speed')
  }
  if(!angle || !validAngle)  {
    errorFields.push("Angle")
  }
  if(!direction || !validDirection) {
    errorFields.push("Direction")
  }
  if(!distance || !validDistance) {
    errorFields.push("Distance")
  }
  if(!autoPitchType) {
    errorFields.push("Pitch Type")
  }

  if(errorFields.length>0) {
    return res.status(400).json({error: `Please fill in all fields with valid values: ${errorFields}`, errorFields})
  }

  try {
    // workout model tests the inputs that we destructured off the request body on the front end and creates an object 
    // if the inputs from the UI meet the criteria set in the Schema. If they do
    // the Workout model creates an object to send back to the front end and returns it in json format.
    // adds document to the DB in MongoDB too 
    
    const battingPractice = await BPWorkout.create({player, bpType, date, exitSpeed, angle, direction, distance, autoPitchType, user_id})
    console.log(`new battingPractice Entry added to the DB ${battingPractice}`)
    return res.status(200).json(battingPractice)
  } catch(error) {
    return res.status(400).json({error:error.message})
  }
}

  // Validate each batting practice entry in the array
 // Create multiple batting practices from CSV upload
const createBattingPractices = async (req, res) => {
  const user_id = req.user._id;


  const { workouts } = req.body;

  if (!workouts || !Array.isArray(workouts)) {
    return res.status(400).json({ error: "No valid batting practices found in the request" });
  }

  let errorFields = [];

 
  // Validate each batting practice entry in the array
  workouts.forEach((bp, index) => {
    const { player, bpType, date, exitSpeed, angle, direction, distance, autoPitchType } = bp;
    
    const inputDate = new Date(date);
    const today = new Date();
    const validExitSpeed = exitSpeed => exitSpeed >= 0 && exitSpeed <= 130;
    const validAngle = angle => angle >= -180 && angle <= 180;
    const validDirection = direction => direction >= -180 && direction <= 180;
    const validDistance = distance => distance >= 0 && distance <= 600;

    let invalidFields = [];

    if (!player) invalidFields.push("player");
    if (!bpType) invalidFields.push("bpType");
    if (!date || inputDate > today) invalidFields.push("date");
    if (!exitSpeed || !validExitSpeed(exitSpeed)) invalidFields.push("exitSpeed");
    if (!angle && angle!==0 || !validAngle(angle)) invalidFields.push("angle");
    if (!direction && direction !==0 || !validDirection(direction)) invalidFields.push("direction");
    if (!distance || !validDistance(distance)) invalidFields.push("distance");
    if (!autoPitchType) invalidFields.push("autoPitchType");
  
    if (invalidFields.length > 0) {
      errorFields.push({ index, player, bpType, message: "Invalid data", invalidFields });
    }
  });

  // Check if there are any validation errors
  if (errorFields.length > 0) {
    return res.status(400).json({ error: "Some entries contain invalid data", errorFields });
  }

  try {
    // Add the user_id to each entry before saving

    const battingPracticesToSave = workouts.map(bp => ({
      ...bp,
      user_id
    }));

    // Use insertMany for batch creation
    const createdBattingPractices = await BPWorkout.insertMany(battingPracticesToSave);
    
    res.status(200).json(createdBattingPractices);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create multiple batting practices.' });
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

// delete all bp entries
const deleteBattingPractices = async (req, res) => {
  try {
    const user_id = req.user.id;
    const user = await User.findById(user_id);
    if (!user || !user.isAdmin) {
      return res.status(403).json({ error: 'Unauthorized user cannot delete all' });
    }
    
    const battingPractice = await BPWorkout.deleteMany({})

    if (!battingPractice) {
      return res.status(400).json({error: 'No BP workouts to delete'})
    }
    res.status(200).json({message:"All BP workouts deleted successfully"})
  } catch(error) {
    res.status(500).json({error: 'Failed to delete BP workouts'})
  }
  
}
 
// edit bp
const updateBattingPractice = async (req, res) => {
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
  deleteBattingPractice,
  createBattingPractices,
  updateBattingPractice,
  deleteBattingPractices
}