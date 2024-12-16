const express = require('express');
const router = express.Router();
const QuestionController = require('./question.controller');

router.get('/', QuestionController.getFilteredQuestions);
router.get('/:id', QuestionController.getQuestionById);
router.post('/', QuestionController.createQuestion);
router.put('/:id', QuestionController.updateQuestion);
router.delete('/:id', QuestionController.deleteQuestion);

module.exports = router;