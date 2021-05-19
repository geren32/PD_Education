const express = require('express');
const router = express.Router();
const educator = require('../controllers/educator-controller')


router.get('/GetAssignedTraining/:user_id', educator.GetAssignedTraining)
router.post('/getEducatorData',educator.getEducatorData)
router.post('/createEducatorDate',educator.createEducatorDate)
router.get('/getProductsForTraining',educator.getProductsForTraining)
router.post('/lessonConfirmation',educator.lessonConfirmation)
router.get('/productForOrder', educator.productForOrder)
router.get('/getEquipmentEducator',educator.getEquipmentEducator)
router.post('/changeRequestEquipmentEducator',educator.changeRequestEquipmentEducator)

router.post('/createReportForEducation',educator.createReportForEducation)
router.post('/createEducationKilometers',educator.createEducationKilometers)


module.exports = router;

