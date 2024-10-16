const express = require('express')
const {createBattingPractice, getAllBattingPractices, getOneBattingPractice, updateBattingPracitce, deleteBattingPractice } 
= require('../controllers/battingPracticeController')
const requireAuth = require('../middleware/requireAuth')


//creates an instance of express router which we must first require in
const router = express.Router()
// all routes after this line require authentication and must pass through the authentication function before next is invoked
router.use(requireAuth)

router.post('/data-input/bpentry', createBattingPractice)

router.patch('/:id', updateBattingPracitce) 

router.delete('/:id', deleteBattingPractice)


module.exports = router