const questionElement = document.getElementById('question');
const optionsContainer = document.querySelector('.options');
const nextButton = document.querySelector('.next-btn');
const timerElement = document.getElementById('time');
const questionCountElement = document.querySelector('.question-count');

let currentQuestionIndex = 0;
let score = 0;
let questions = [];
let timeLeft = 15;
let timer;

async function fetchQuestions() {
    try {
        const response = await fetch('https://opentdb.com/api.php?amount=5&type=multiple');
        const data = await response.json();
        questions = data.results.map(question => ({
            question: question.question,
            answers: [...question.incorrect_answers, question.correct_answer].sort(() => Math.random() - 0.5),
            correctAnswer: question.correct_answer
        }));
        startQuiz();
    } catch (error) {
        console.error('Error fetching questions:', error);
        questionElement.textContent = 'Questions Load Error.';
    }
}

function startQuiz() {
    currentQuestionIndex = 0;
    score = 0;
    showQuestion();
}

function showQuestion() {
    resetState();

    const currentQuestion = questions[currentQuestionIndex];
    const questionNo = currentQuestionIndex + 1;

    questionElement.innerHTML = `${questionNo}. ${currentQuestion.question}`;
    questionCountElement.textContent = `${questionNo} of ${questions.length} Questions`;

    currentQuestion.answers.forEach(answer => {
        const button = document.createElement('div');
        button.innerHTML = answer;
        button.classList.add('option');
        optionsContainer.appendChild(button);
        button.addEventListener('click', selectAnswer);
    });

    startTimer();
}

function resetState() {
    clearInterval(timer);
    optionsContainer.innerHTML = '';
    nextButton.classList.add('hide');
}

function selectAnswer(e) {
    const selectedAnswer = e.target.innerHTML;
    const correctAnswer = questions[currentQuestionIndex].correctAnswer;

    if (selectedAnswer === correctAnswer) {
        score++;
        questionElement.innerHTML = 'Correct answer! +1 point';
    } else {
        questionElement.innerHTML = 'wrong answer!';
    }

    nextButton.classList.remove('hide');
    clearInterval(timer);
}

function startTimer() {
    timeLeft = 15;
    timerElement.innerHTML = timeLeft;

    timer = setInterval(() => {
        timeLeft--;
        timerElement.innerHTML = timeLeft;

        if (timeLeft === 0) {
            clearInterval(timer);
            selectAnswer({ target: { innerHTML: questions[currentQuestionIndex].correctAnswer } });
        }
    }, 1000);
}

function handleNextButtonClick() {
    if (currentQuestionIndex === questions.length - 1) {
        showResult();
    } else {
        currentQuestionIndex++;
        showQuestion();
    }
}

function showResult() {
    questionElement.innerHTML = `Your final score: ${score}/${questions.length}`;
    nextButton.classList.add('hide');
}

nextButton.addEventListener('click', handleNextButtonClick);

fetchQuestions();
