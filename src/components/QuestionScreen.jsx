export default function QuestionScreen({
  currentQuestion,
  currentQuestionIndex,
  questionsLength,
  shuffledAnswers,
  selectedAnswer,
  isAnswered,
  handleAnswer,
  handleNext,
}) {
  return (
    <div className="w-[500px] h-screen mx-auto text-center bg-blue-900 text-white space-y-5">
      <h1>Question {currentQuestionIndex + 1} / {questionsLength}</h1>
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
            className={`w-[450px] mx-auto p-2 border-2 rounded-full mb-2 cursor-pointer ${borderColor} flex items-center text-left`}
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
        className={`w-[300px] mt-4 px-4 py-2 rounded-full text-white ${
          isAnswered ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-400 cursor-not-allowed'
        }`}
      >
        Next
      </button>
    </div>
  );
}
