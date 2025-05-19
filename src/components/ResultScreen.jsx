import congratulation from './assets/images/congratulation.jpg';

export default function ResultScreen({ score, questionsLength, seconds, handlePlayAgain }) {
  return (
    <div className="w-[500px] h-screen mx-auto text-center text-xl space-y-5">
      <div className="w-full mx-auto">
        <img src={congratulation} alt="congratulation" />
      </div>
      <h1>You are amazing!</h1>
      <h1>{score} / {questionsLength} correct answers in {seconds} seconds.</h1>
      <button
        onClick={handlePlayAgain}
        className="px-4 py-2 rounded-full text-white bg-red-600 hover:bg-red-700"
      >
        Play again
      </button>
    </div>
  );
}
