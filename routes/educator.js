const express = require('express');
const router = express.Router();
const educator = require('../controllers/educator-controller')


router.get('/GetAssignedTraining', educator.GetAssignedTraining)
    .post('/getData',educator.getDatta)
    .post('/getProductsForTraining',educator.getProductsForTraining)
    .get ('/alreadyTraining',educator.alreadyTraining)


module.exports = router;


