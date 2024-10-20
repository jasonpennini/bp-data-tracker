// mongoose allows us to create a Schema in the DB. The schema allows us to control the type of data in the DB and set criteria.
const mongoose = require('mongoose')

const Schema = mongoose.Schema
const bpWorkoutSchema = new Schema ({
  player: {
    type: String,
    required:true,
  },
  bpType: {
    type: String,
    required:true, 
  },
  date: {
    type: Date,
    required:true,
    max:Date.now,
  },
  exitSpeed: {
    type: Number,
    required:true,
    min:0,
    max:130,
  },
  angle: {
    type: Number,
    required:true,
    min:-180,
    max:180,
  },
  direction: {
    type:Number,
    required:true,
    min:-180,
    max:180,
  },
  distance: {
    type:Number,
    required:true,
    min:0,
    max:600,
  },
  autoPitchType: {
    type:String,
    required:true,
  }, 
  user_id: {
    type:String,
    required:true,
  }
}, {timestamps: true})

//creates the model based on the schema we created above
module.exports = mongoose.model('BPWorkout', bpWorkoutSchema)