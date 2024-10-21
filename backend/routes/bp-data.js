const express = require('express')
const {createBattingPractice, getAllBattingPractices, getOneBattingPractice, deleteBattingPractice, createBattingPractices, updateBattingPractice, deleteBattingPractices } 
= require('../controllers/battingPracticeController')
const requireAuth = require('../middleware/requireAuth')


//creates an instance of express router which we must first require in
const router = express.Router()
// all routes after this line require authentication and must pass through the authentication function before next is invoked
router.use(requireAuth)

// route handler will handle get requests to local host 4000/ 
// will send a request to the server and a response back to the front end, the req/res objects allow us to persist data
router.get('/', getAllBattingPractices) 
  // we are sending a response object back to front end with a message

router.get('/:id', getOneBattingPractice)

router.post('/navbar/data-input/bpentry', createBattingPractice)
router.post('/', createBattingPractices)

router.patch('/', updateBattingPractice)

router.delete('/:id', deleteBattingPractice)
router.delete('/', deleteBattingPractices)

module.exports = router