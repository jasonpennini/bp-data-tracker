const express = require('express')
const {createBattingPractice, getAllBattingPractices, getOneBattingPractice, updateBattingPracitce, deleteBattingPractice } 
= require('../controllers/battingPracticeController')


//creates an instance of express router which we must first require in
const router = express.Router()

// route handler will handle get requests to local host 4000/ 
// will send a request to the server and a response back to the front end, the req/res objects allow us to persist data
router.get('/', getAllBattingPractices) 
  // we are sending a response object back to front end with a message

router.get('/:id', getOneBattingPractice)

router.post('/', createBattingPractice)

router.patch('/:id', updateBattingPracitce) 

router.delete('/:id', deleteBattingPractice)


module.exports = router