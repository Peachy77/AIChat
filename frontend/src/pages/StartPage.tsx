import { useNavigate } from 'react-router-dom';
import { Brain } from 'lucide-react';

function StartPage() {
  const navigate = useNavigate();

  const handleStart = () => {
    const roomId = Math.floor(Math.random() * 1000000);
    navigate(`/chat/${roomId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center p-6">
      <div className="text-center max-w-md w-full">
        <div className="mb-12">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
              <Brain className="w-12 h-12 text-white" />
            </div>
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            AI 脑筋急转弯
          </h1>
          <p className="text-gray-600 text-lg">
            挑战你的智慧，与AI一起玩转脑筋急转弯
          </p>
        </div>

        <button
          onClick={handleStart}
          className="w-full max-w-sm mx-auto px-8 py-4 bg-blue-500 text-white text-lg font-semibold rounded-2xl hover:bg-blue-600 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          开始游戏
        </button>

        <div className="mt-12 text-sm text-gray-500">
          <p>与AI主持人互动，解决有趣的脑筋急转弯</p>
        </div>
      </div>
    </div>
  );
}

export default StartPage;
