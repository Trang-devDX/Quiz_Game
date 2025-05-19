import { useState, useEffect } from 'react';
import StartScreen from './StartScreen';
import ResultScreen from './ResultScreen';
import QuestionScreen from './QuestionScreen';

function QuizGame() {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [shuffledAnswers, setShuffledAnswers] = useState([]);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [seconds, setSeconds] = useState(0);

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
      const allAnswers = [...current.incorrect_answers, current.correct_answer];
      setShuffledAnswers(shuffleArray(allAnswers));
    }
  }, [questions, currentQuestionIndex]);

  useEffect(() => {
    let timer;
    if (isGameStarted && !showResults) {
      timer = setInterval(() => {
        setSeconds(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isGameStarted, showResults]);

  const handleAnswer = (answer) => {
    setSelectedAnswer(answer);
    setIsAnswered(true);
    if (answer === questions[currentQuestionIndex].correct_answer) {
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

  const handlePlayAgain = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setScore(0);
    setShowResults(false);
    setIsAnswered(false);
    setIsGameStarted(false);
    setSeconds(0);
  };

  if (!isGameStarted) {
    return <StartScreen handleStartGame={handleStartGame} />;
  }

  if (showResults) {
    return (
      <ResultScreen
        score={score}
        questionsLength={questions.length}
        seconds={seconds}
        handlePlayAgain={handlePlayAgain}
      />
    );
  }

  if (questions.length === 0) return <div>Loading questions...</div>;
  const currentQuestion = questions[currentQuestionIndex];
  if (!currentQuestion) return <div>Loading current question...</div>;

  return (
    <QuestionScreen
      currentQuestion={currentQuestion}
      currentQuestionIndex={currentQuestionIndex}
      questionsLength={questions.length}
      shuffledAnswers={shuffledAnswers}
      selectedAnswer={selectedAnswer}
      isAnswered={isAnswered}
      handleAnswer={handleAnswer}
      handleNext={handleNext}
    />
  );
}

export default QuizGame;
