const questionRepository = require('../../infrastructure/repositories/question/question.repository');
const questionLogRepository = require('../../infrastructure/repositories/question-log/qustion-log');
const { encryptData, encryptOptions, encryptMcqOptions, encryptComprehensionOptions, decryptData, decryptMcqOptions, decryptComprehensionOptions } = require('../../domain/question/encrypt-decrypt');
const CHUNK_SIZE = 100;

class QuestionService {
    async createQuestion(payload) {
        const QID = await questionRepository.getOrCreateQID();
        const createdQuestion = await questionRepository.create({
            ...payload,
            question: Object.keys(payload.question).reduce((acc, lang) => {
                acc[lang] = encryptData(payload.question[lang]);
                return acc;
            }, {}),
            options: {
                mcq: encryptMcqOptions(payload?.options?.mcq),
                comprehension: encryptComprehensionOptions(payload?.options?.comprehension),
            },
            QID,
        });

        await questionLogRepository.create({
            questionId: createdQuestion._id,
            action: 'created',
            details: `Question created with QID: ${createdQuestion.QID}`,
            user: payload.createdBy,
        });

        return createdQuestion;
    }

    async bulkUploadQuestions(questions) {
        let successCount = 0;
        let errorCount = 0;
        const errors = [];

        // Split the questions into chunks for batch processing
        const chunks = [];
        for (let i = 0; i < questions.length; i += CHUNK_SIZE) {
            chunks.push(questions.slice(i, i + CHUNK_SIZE));
        }

        // Process each chunk sequentially
        for (const chunk of chunks) {
            try {
                // Fetch the last QID before processing the chunk
                let lastQID = await questionRepository.getOrCreateQID();
                lastQID = (parseInt(lastQID) - 1).toString().padStart(15, '0');

                const results = await Promise.all(
                    chunk.map(async (question, index) => {
                        // Generate a unique QID for each question in the chunk
                        const QID = (parseInt(lastQID) + 1).toString().padStart(15, '0'); // Incrementing QID for each question
                        lastQID = QID; // Update lastQID for next question

                        const createdQuestion = await questionRepository.create({
                            ...question,
                            question: Object.keys(question.question).reduce((acc, lang) => {
                                acc[lang] = encryptData(question.question[lang]);
                                return acc;
                            }, {}),
                            options: {
                                mcq: encryptMcqOptions(question?.options?.mcq),
                                comprehension: encryptComprehensionOptions(question?.options?.comprehension),
                            },
                            QID
                        });

                        // Log the creation
                        await questionLogRepository.create({
                            questionId: createdQuestion._id,
                            action: 'created',
                            details: `Bulk uploaded question with QID: ${createdQuestion.QID}`,
                            user: question.createdBy || '64f87cd2e2543a0012d34574',
                        });

                        return { success: true };
                    })
                );

                successCount += results.filter((result) => result.success).length;
            } catch (error) {
                errorCount += chunk.length;
                errors.push({ chunk, error: error.message });
            }
        }

        return { successCount, errorCount, errors };
    }

    async getFilteredQuestions(queryParams, projection, options) {
        const { page = 1, limit = 10, QID, subject, topic, subTopic, sortBy = 'createdAt', sortOrder = 'asc', ...filters } = queryParams;

        const query = { ...filters };
        if (QID) query.QID = QID;
        if (subject) query.subject = subject;
        if (topic) query.topic = topic;
        if (subTopic) query.subTopic = subTopic;

        const skip = (page - 1) * limit;
        const sortOptions = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };

        const questions = await questionRepository.find(query, projection, { ...options, skip, limit: parseInt(limit), sort: sortOptions });
        const total = await questionRepository.count(query);

        const decryptedQuestions = questions.map((question) => ({
            ...question.toObject(),
            question: Array.from(question.question.entries()).reduce((acc, [lang, encryptedText]) => { 
                console.log('lang: ', lang, encryptedText);
                acc[lang] = decryptData(encryptedText);  
                return acc;
            }, {}),
            options: {
                mcq: decryptMcqOptions(question?.options?.mcq),
                comprehension: decryptComprehensionOptions(question?.options?.comprehension),
            },
        }));

        return { total, page: parseInt(page), limit: parseInt(limit), questions: decryptedQuestions };
    }

    async getQuestionById(id) {
        const question = await questionRepository.findById({ _id: id }, null, {});
        if (!question) throw new Error('Question not found.');

        return {
            ...question,
            question: Object.keys(question.question).reduce((acc, lang) => {
                acc[lang] = decryptData(question.question[lang]);
                return acc;
            }, {}),
            options: {
                mcq: decryptMcqOptions(question?.options?.mcq),
                comprehension: decryptComprehensionOptions(question?.options?.comprehension),
            },
        };
    }

    async updateQuestion(id, payload) {
        const updatedQuestion = await questionRepository.update({ _id: id }, {
            ...payload,
            question: Object.keys(payload.question).reduce((acc, lang) => {
                acc[lang] = encryptData(payload.question[lang]);
                return acc;
            }, {}),
            options: {
                mcq: encryptMcqOptions(payload?.options?.mcq),
                comprehension: encryptComprehensionOptions(payload?.options?.comprehension),
            },
        });

        await questionLogRepository.create({
            questionId: id,
            action: 'updated',
            details: `Question updated with payload: ${JSON.stringify(payload)}`,
            user: payload.updatedBy,
        });

        return updatedQuestion;
    }

    async addOrUpdateReview(questionId, { user, comment, status }) {
        const question = await questionRepository.findById({ _id: questionId });
        if (!question) {
            throw new Error('Question not found.');
        }

        const existingReviewIndex = question.reviewer.findIndex(
            (review) => review.user.toString() === user
        );

        if (existingReviewIndex !== -1) {
            question.reviewer[existingReviewIndex].comment = comment;
            question.reviewer[existingReviewIndex].date = new Date();
        } else {
            question.reviewer.push({ user, comment, date: new Date() });
        }

        if (status) {
            question.questionStatus = status;
        }

        const updatedQuestion = await question.save();

        // Log the review action
        await questionLogRepository.create({
            questionId,
            action: 'reviewed',
            details: `Review added/updated by user: ${user}, comment: ${comment}`,
            user,
        });

        return updatedQuestion;
    }

    async deleteQuestion(id) {
        const deletedQuestion = questionRepository.delete({ _id: id });

        await questionLogRepository.create({
            questionId: id,
            action: 'deleted',
            details: `Question with ID ${id} was deleted.`,
            user: deletedBy,
        });

        return deletedQuestion;
    }

    async getQuestionLogs(questionId) {
        const logs = await questionLogRepository.find({ questionId });
        if (!logs) {
            throw new Error('No logs found for the given question.');
        }
        return logs;
    }
}

module.exports = new QuestionService();
