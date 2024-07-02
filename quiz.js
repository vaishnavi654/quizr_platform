document.addEventListener('DOMContentLoaded', () => {
    const quizForm = document.getElementById('quiz-form');
    const questionsContainer = document.getElementById('questions-container');
    const addQuestionButton = document.getElementById('add-question');
    const loadQuizButton = document.getElementById('load-quiz');
    const quizContent = document.getElementById('quiz-content');
    const quizImage = document.getElementById('quiz-image');

    // Load the most recent quiz from local storage
    let quizzes = JSON.parse(localStorage.getItem('quizzes')) || [];
    let currentQuiz = quizzes.length > 0 ? quizzes[quizzes.length - 1] : [];

    function saveQuizzes() {
        localStorage.setItem('quizzes', JSON.stringify([currentQuiz]));
    }

    function createQuestionElement() {
        const questionDiv = document.createElement('div');
        const questionInput = document.createElement('input');
        questionInput.placeholder = 'Enter your question';
        questionDiv.appendChild(questionInput);

        for (let i = 0; i < 4; i++) {
            const answerInput = document.createElement('input');
            answerInput.placeholder = `Answer ${i + 1}`;
            questionDiv.appendChild(answerInput);
        }

        const correctAnswerInput = document.createElement('input');
        correctAnswerInput.placeholder = 'Correct Answer (1-4)';
        questionDiv.appendChild(correctAnswerInput);

        return questionDiv;
    }

    addQuestionButton.addEventListener('click', () => {
        questionsContainer.appendChild(createQuestionElement());
    });

    quizForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const questions = [];
        questionsContainer.querySelectorAll('div').forEach(questionDiv => {
            const question = questionDiv.children[0].value;
            const answers = [];
            for (let i = 1; i <= 4; i++) {
                answers.push(questionDiv.children[i].value);
            }
            const correctAnswer = questionDiv.children[5].value;
            questions.push({ question, answers, correctAnswer: parseInt(correctAnswer, 10) });
        });
        currentQuiz = questions;
        saveQuizzes();
        questionsContainer.innerHTML = ''; // Clear the questions container after saving the quiz
        alert('Quiz saved successfully!');
    });

    loadQuizButton.addEventListener('click', () => {
        quizContent.innerHTML = ''; // Clear the quiz content when loading a quiz

        if (currentQuiz.length === 0) {
            alert('No quiz available. Please create a new quiz.');
            return;
        }

        quizImage.style.display = 'none'; // Hide the image when the quiz is loaded

        currentQuiz.forEach((q, index) => {
            const questionDiv = document.createElement('div');
            const questionText = document.createElement('p');
            questionText.textContent = q.question;
            questionDiv.appendChild(questionText);

            q.answers.forEach((answer, i) => {
                const answerLabel = document.createElement('label');
                const answerInput = document.createElement('input');
                answerInput.type = 'radio';
                answerInput.name = `question-${index}`;
                answerInput.value = i + 1;
                answerLabel.appendChild(answerInput);
                answerLabel.appendChild(document.createTextNode(answer));
                questionDiv.appendChild(answerLabel);
            });

            quizContent.appendChild(questionDiv);
        });

        const submitButton = document.createElement('button');
        submitButton.textContent = 'Submit Quiz';
        submitButton.addEventListener('click', () => {
            let score = 0;
            currentQuiz.forEach((q, index) => {
                const userAnswer = parseInt(document.querySelector(`input[name="question-${index}"]:checked`)?.value, 10);
                if (userAnswer === q.correctAnswer) {
                    score++;
                }
            });
            alert(`Your score is ${score} out of ${currentQuiz.length}`);
        });
        quizContent.appendChild(submitButton);
    });

    // Clear questions container and quiz content on page load
    questionsContainer.innerHTML = '';
    quizContent.innerHTML = '';
});
