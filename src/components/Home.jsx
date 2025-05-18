import { useState, useEffect } from 'react';

function QuizGame() {
    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [score, setScore] = useState(0);
    const [showResults, setShowResults] = useState(false);
    const [shuffledAnswers, setShuffledAnswers] = useState([]);

    // Hàm trộn mảng
    function shuffleArray(array) {
        return [...array].sort(() => Math.random() - 0.5);
    }

    // Gọi API lấy câu hỏi
    useEffect(() => {
        fetch('https://opentdb.com/api.php?amount=5')
            .then(response => response.json())
            .then(data => {
                if (data && Array.isArray(data.results)) {
                    setQuestions(data.results);
                } else {
                    console.error('Data format invalid:', data);
                }
            })
            .catch(error => {
                console.error('Error fetching questions:', error);
            });
    }, []);

    // Trộn đáp án mỗi khi đổi câu hỏi
    useEffect(() => {
        if (questions.length > 0 && currentQuestionIndex < questions.length) {
            const currentQuestion = questions[currentQuestionIndex];
            const allAnswers = [
                ...currentQuestion.incorrect_answers,
                currentQuestion.correct_answer,
            ];
            setShuffledAnswers(shuffleArray(allAnswers));
        }
    }, [questions, currentQuestionIndex]);

    // Loading
    if (!Array.isArray(questions) || questions.length === 0) {
        return <div>Loading questions...</div>;
    }

    const currentQuestion = questions[currentQuestionIndex];

    if (!currentQuestion) {
        return <div>Loading current question...</div>;
    }

    // Xử lý khi chọn đáp án
    const handleAnswer = (answer) => {
        const isCorrect = answer === currentQuestion.correct_answer;
        if (isCorrect) {
            setScore(prev => prev + 1);
        }

        setSelectedAnswer(answer);

        setTimeout(() => {
            if (currentQuestionIndex === questions.length - 1) {
                setShowResults(true);
            } else {
                setCurrentQuestionIndex(prev => prev + 1);
                setSelectedAnswer(null);
            }
        }, 1000);
    };

    // Kết quả
    if (showResults) {
        return (
            <>
                <h1>Results</h1>
                <p>Your score: {score} / {questions.length}</p>
            </>
        );
    }

    // Giao diện chính
    return (
        <>
            <h1>Quiz Game</h1>
            <p>Welcome to the Quiz Game! Test your knowledge and have fun!</p>

            <p dangerouslySetInnerHTML={{ __html: currentQuestion.question }} />

            {shuffledAnswers.map((answer, index) => (
                <div key={index}>
                    <input
                        type="radio"
                        id={`answer-${index}`}
                        name="answer"
                        value={answer}
                        checked={selectedAnswer === answer}
                        onChange={() => handleAnswer(answer)}
                    />
                    <label htmlFor={`answer-${index}`} dangerouslySetInnerHTML={{ __html: answer }} />
                </div>
            ))}
        </>
    );
}

export default QuizGame;
