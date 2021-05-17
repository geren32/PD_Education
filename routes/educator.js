const express = require('express');
const router = express.Router();
const educator = require('../controllers/educator-controller')


router.post('/GetAssignedTraining', educator.GetAssignedTraining)
router.post('/getEducatorData',educator.getEducatorData)
router.post('/createEducatorDate',educator.createEducatorDate)
router.post('/getProductsForTraining',educator.getProductsForTraining)
router.get('/lessonConfirmation',educator.lessonConfirmation)
router.get('/productForOrder', educator.productForOrder)
router.get('/getEquipmentEducator',educator.getEquipmentEducator)
router.post('/changeRequestEquipmentEducator',educator.changeRequestEquipmentEducator)

router.post('/createReportForEducation',educator.createReportForEducation)
router.post('/createEducationKilometers',educator.createEducationKilometers)


module.exports = router;


