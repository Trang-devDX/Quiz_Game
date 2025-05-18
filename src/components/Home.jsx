import { useState, useEffect } from 'react';

function QuizGame() {
    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [score, setScore] = useState(0);
    const [showResults, setShowResults] = useState(false);
    const [shuffledAnswers, setShuffledAnswers] = useState([]);
    const [isAnswered, setIsAnswered] = useState(false);
    const [isGameStarted, setIsGameStarted] = useState(false); 

    function shuffleArray(array) {
        return [...array].sort(() => Math.random() - 0.5);
    }

    useEffect(() => {
        fetch('https://opentdb.com/api.php?amount=5')
            .then(response => response.json())
            .then(data => {
                if (Array.isArray(data.results)) {
                    setQuestions(data.results);
                } else {
                    console.error('Invalid data:', data);
                }
            })
            .catch(err => console.error('Fetch error:', err));
    }, []);

    useEffect(() => {
        if (questions.length > 0 && currentQuestionIndex < questions.length) {
            const current = questions[currentQuestionIndex];
            const allAnswers = [
                ...current.incorrect_answers,
                current.correct_answer,
            ];
            setShuffledAnswers(shuffleArray(allAnswers));
        }
    }, [questions, currentQuestionIndex]);

    if (questions.length === 0) return <div>Loading questions...</div>;
    const currentQuestion = questions[currentQuestionIndex];
    if (!currentQuestion) return <div>Loading current question...</div>;

    const handleAnswer = (answer) => {
        setSelectedAnswer(answer);
        setIsAnswered(true);
        if (answer === currentQuestion.correct_answer) {
            setScore(prev => prev + 1);
        }
    };

    const handleNext = () => {
        if (currentQuestionIndex === questions.length - 1) {
            setShowResults(true);
        } else {
            setCurrentQuestionIndex(prev => prev + 1);
            setSelectedAnswer(null);
            setIsAnswered(false);
        }
    };

    const handleStartGame = () => {
        setIsGameStarted(true);
    };
     if (!isGameStarted) {
        return (
            <div className="text-center mt-10">
                <h1 className="text-2xl font-bold mb-4">Welcome to the Quiz Game</h1>
                <button
                    onClick={handleStartGame}
                    className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                    Start Game
                </button>
            </div>
        );
    }

    if (showResults) {
        return (
            <>
                <h1>Results</h1>
                <p>Your score: {score} / {questions.length}</p>
            </>
        );
    }

    return (
        <div>
            <h1>Question {currentQuestionIndex + 1} / {questions.length}</h1>
            <p dangerouslySetInnerHTML={{ __html: currentQuestion.question }} />

            {shuffledAnswers.map((answer, index) => {
                let borderColor = 'border-gray-300';
                if (isAnswered) {
                    if (answer === currentQuestion.correct_answer) {
                        borderColor = 'border-green-500';
                    } else if (answer === selectedAnswer && answer !== currentQuestion.correct_answer) {
                        borderColor = 'border-red-500';
                    }
                }

                return (
                    <div
                        key={index}
                        className={`p-2 border-2 rounded mb-2 cursor-pointer ${borderColor}`}
                        onClick={() => !isAnswered && handleAnswer(answer)}
                    >
                        <input
                            type="radio"
                            id={`answer-${index}`}
                            name="answer"
                            value={answer}
                            checked={selectedAnswer === answer}
                            onChange={() => handleAnswer(answer)}
                            className="mr-2"
                            disabled={isAnswered}
                        />
                        <label
                            htmlFor={`answer-${index}`}
                            dangerouslySetInnerHTML={{ __html: answer }}
                        />
                    </div>
                );
            })}

            <button
                onClick={handleNext}
                disabled={!isAnswered}
                className={`mt-4 px-4 py-2 rounded text-white ${
                    isAnswered ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'
                }`}
            >
                Next
            </button>
        </div>
    );
}

export default QuizGame;
