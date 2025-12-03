import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Send, Bot, User, History } from 'lucide-react';
import { chatApi, ChatMessage } from '../services/api';

interface Conversation {
  id: number;
  title: string;
  timestamp: Date;
}

function ChatPage() {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isStarted, setIsStarted] = useState(false);
  const [isEnded, setIsEnded] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!roomId) {
      navigate('/');
    }
    loadConversationHistory();
  }, [roomId, navigate]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadConversationHistory = () => {
    const saved = localStorage.getItem('conversations');
    if (saved) {
      const parsedConversations = JSON.parse(saved).map((conv: any) => ({
        ...conv,
        timestamp: new Date(conv.timestamp),
      }));
      setConversations(parsedConversations);
    }
  };

  const saveConversation = () => {
    if (messages.length === 0) return;

    const newConversation: Conversation = {
      id: Date.now(),
      title: `对话 ${new Date().toLocaleTimeString()}`,
      timestamp: new Date(),
    };

    const updated = [newConversation, ...conversations];
    setConversations(updated);
    localStorage.setItem('conversations', JSON.stringify(updated));
  };

  const sendMessage = async (content: string) => {
    if (!content.trim() || !roomId || isSending) return;

    setIsSending(true);
    const userMessage: ChatMessage = {
      role: 'user',
      content,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');

    try {
      const aiResponse = await chatApi.sendMessage(parseInt(roomId), content);
      const aiMessage: ChatMessage = {
        role: 'ai',
        content: aiResponse,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);

      if (aiResponse.includes('游戏已结束')) {
        setIsEnded(true);
        saveConversation();
      }

      if (!isStarted) {
        setIsStarted(true);
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      const errorMessage: ChatMessage = {
        role: 'ai',
        content: '抱歉，发送消息失败，请重试',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsSending(false);
    }
  };

  const handleStart = () => {
    sendMessage('开始');
  };

  const handleEnd = () => {
    sendMessage('结束');
  };

  const handleSend = () => {
    sendMessage(inputValue);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex">
      <div className="w-64 bg-white border-r border-gray-200 shadow-sm flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center gap-2 mb-4">
            <History className="w-5 h-5 text-gray-600" />
            <h2 className="text-lg font-semibold text-gray-800">历史对话</h2>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {conversations.length === 0 ? (
            <div className="p-4 text-center text-gray-500 text-sm">
              <p>暂无对话记录</p>
            </div>
          ) : (
            <div className="space-y-2 p-3">
              {conversations.map((conv) => (
                <div
                  key={conv.id}
                  className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors text-sm border border-gray-200"
                >
                  <p className="font-medium text-gray-800 truncate">{conv.title}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {conv.timestamp.toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        <div className="bg-white shadow-sm border-b border-gray-200 p-6">
          <div className="flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-800">AI 脑筋急转弯</h1>
              <p className="text-sm text-gray-600 mt-2">
                房间号: <span className="font-mono font-semibold text-gray-900">{roomId}</span>
              </p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-8 flex justify-center">
          <div className="w-full max-w-2xl space-y-4">
            {messages.length === 0 && (
              <div className="text-center text-gray-500 mt-20">
                <Bot className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <p className="text-lg">点击"开始游戏"开始你的脑筋急转弯之旅</p>
              </div>
            )}

            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex items-start gap-3 ${
                  message.role === 'user' ? 'flex-row-reverse' : ''
                }`}
              >
                <div
                  className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                    message.role === 'ai'
                      ? 'bg-blue-100 text-blue-600'
                      : 'bg-green-100 text-green-600'
                  }`}
                >
                  {message.role === 'ai' ? (
                    <Bot className="w-6 h-6" />
                  ) : (
                    <User className="w-6 h-6" />
                  )}
                </div>

                <div
                  className={`flex-1 max-w-xl ${
                    message.role === 'user' ? 'flex justify-end' : ''
                  }`}
                >
                  <div
                    className={`px-4 py-3 rounded-2xl shadow-sm ${
                      message.role === 'ai'
                        ? 'bg-white text-gray-800 border border-gray-200'
                        : 'bg-green-500 text-white'
                    }`}
                  >
                    <p className="whitespace-pre-wrap break-words">{message.content}</p>
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>

        <div className="bg-white border-t border-gray-200 p-6">
          <div className="max-w-2xl mx-auto space-y-4">
            <div className="flex gap-3 justify-center">
              <button
                onClick={handleStart}
                disabled={isStarted || isSending}
                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
              >
                开始游戏
              </button>
              <button
                onClick={handleEnd}
                disabled={isEnded || !isStarted || isSending}
                className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
              >
                结束游戏
              </button>
            </div>

            <div className="flex gap-3">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="请输入内容"
                disabled={isSending}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
              />
              <button
                onClick={handleSend}
                disabled={!inputValue.trim() || isSending}
                className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center gap-2 font-medium"
              >
                <Send className="w-5 h-5" />
                发送
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatPage;
