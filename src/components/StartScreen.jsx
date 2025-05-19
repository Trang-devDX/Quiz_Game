import quiz_image from './assets/images/quiz.jpg';

export default function StartScreen({ handleStartGame }) {
  return (
    <div className="w-[500px] h-screen mx-auto text-center">
      <div className="w-full mx-auto">
        <img src={quiz_image} alt="quiz_image" />
      </div>
      <button
        onClick={handleStartGame}
        className="px-6 py-3 bg-red-600 text-white rounded-full hover:bg-red-700"
      >
        Start Quiz!
      </button>
    </div>
  );
}
