const router = require("express").Router();
const examinationController = require('./examination.controller');

router.post('/', examinationController.createExamination);
router.get('/', examinationController.getExaminations);
router.get('/:id', examinationController.getExaminationById);
router.put('/:id', examinationController.updateExamination);
router.delete('/:id', examinationController.deleteExamination);

module.exports = router;