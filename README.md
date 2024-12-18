# question-management-service
comprehension format : 
{
    "QID": "Q67890",
    "type": "comprehension",
    "language": ["en", "fr"],
    "questionCode1": "XYZ5678",
    "questionCode2": "LMN1234",
    "examinationId": "64f87c02e2543a0012d34567",
    "subject": "64f87c82e2543a0012d34568",
    "topic": "64f87c92e2543a0012d34569",
    "subTopic": "64f87ca2e2543a0012d34570",
    "difficultyLevel": "64f87cb2e2543a0012d34571",
    "level": "64f87cc2e2543a0012d34572",
    "userCode": "USR002",
    "questionStatus": "creation",
    "question": {
        "en": "Choose the correct answer based on the paragraph provided.",
        "fr": "Choisissez la bonne réponse en fonction du paragraphe fourni."
    },
    "options": {
        "mcq": {},
        "comprehension": {
            "en": [
                {
                    "question": "What is the capital of Spain?",
                    "options": [
                        { "option": "Madrid", "isCorrect": true },
                        { "option": "Barcelona", "isCorrect": false },
                        { "option": "Sevilla", "isCorrect": false }
                    ]
                }
            ],
            "fr": [
                {
                    "question": "Quelle est la capitale de l'Espagne?",
                    "options": [
                        { "option": "Madrid", "isCorrect": true },
                        { "option": "Barcelone", "isCorrect": false },
                        { "option": "Séville", "isCorrect": false }
                    ]
                }
            ]
        }
    },
    "assignedUsers": ["64f87cd2e2543a0012d34574"],
    "tags": ["geography", "comprehension"],
    "slug": "geography-comprehension"
}


MCQ:
{
    "QID": "Q12345",
    "type": "mcq",
    "language": ["en", "fr"],
    "questionCode1": "ABC1234",
    "questionCode2": "DEF5678",
    "examinationId": "64f87c02e2543a0012d34567",
    "subject": "64f87c82e2543a0012d34568",
    "topic": "64f87c92e2543a0012d34569",
    "subTopic": "64f87ca2e2543a0012d34570",
    "difficultyLevel": "64f87cb2e2543a0012d34571",
    "level": "64f87cc2e2543a0012d34572",
    "userCode": "USR001",
    "questionStatus": "creation",
    "question": {
        "en": "What is the capital of France?",
        "fr": "Quelle est la capitale de la France?"
    },
    "options": {
        "mcq": {
            "en": [
                { "option": "Paris", "isCorrect": true },
                { "option": "London", "isCorrect": false },
                { "option": "Rome", "isCorrect": false }
            ],
            "fr": [
                { "option": "Paris", "isCorrect": true },
                { "option": "Londres", "isCorrect": false },
                { "option": "Rome", "isCorrect": false }
            ]
        },
        "comprehension": {}
    },
    "assignedUsers": ["64f87cd2e2543a0012d34573"],
    "tags": ["geography", "quiz"],
    "slug": "geography-quiz"
}

