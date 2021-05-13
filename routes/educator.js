const express = require('express');
const router = express.Router();
const educator = require('../controllers/educator-controller')


router.get('/GetAssignedTraining', educator.GetAssignedTraining)
router.post('/getEducatorData',educator.getEducatorData)
router.post('/createEducatorDate',educator.createEducatorDate)
router.post('/getProductsForTraining',educator.getProductsForTraining)
router.get('/lessonConfirmation',educator.lessonConfirmation)
router.post('/productForOrder', educator.productForOrder)


module.exports = router;


