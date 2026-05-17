import { useAuthStore } from '../hooks/useAuth';

export default function NoticeModal() {
  const { hasSeenNotice, markNoticeSeen } = useAuthStore();

  if (hasSeenNotice) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full mx-4 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6">
          <h2 className="text-2xl font-bold text-white text-center">📢 站公告</h2>
        </div>
        
        <div className="p-8 space-y-4 font-serif">
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
            <p className="text-yellow-800 font-medium">⚠️ 重要提示</p>
          </div>
          
          <div className="space-y-3 text-gray-700">
            <p>📍 此处文章皆为虚构，请勿带入现实</p>
            <p>🚫 请不要将此网站分享给未成年人，内含18+内容请自行选择观看</p>
            <p>📚 此网站建立目的就是存放文章方便看</p>
            <hr className="my-4 border-gray-200" />
            <p className="text-blue-600 font-medium">✉️ 如果你想要加入投稿，请联系站长</p>
            <p className="text-gray-600 ml-4">• email：foxmin0803@outlook.com</p>
            <p className="text-gray-600 ml-4">• 微博/小红书：@金奎闵</p>
          </div>
        </div>
        
        <div className="bg-gray-50 p-6">
          <button
            onClick={markNoticeSeen}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-xl font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
          >
            我已阅读并同意
          </button>
        </div>
      </div>
    </div>
  );
}
