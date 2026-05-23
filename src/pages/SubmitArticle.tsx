import { Link } from 'react-router-dom';

export default function SubmitArticle() {
  return (
    <div className="min-h-screen bg-gray-50 font-serif">
      {/* Navigation */}
      <nav className="bg-white shadow-sm sticky top-0 z-20">
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900">ATEEZ 甲板后厨</h2>
          <Link
            to="/"
            className="text-sm text-blue-600 hover:text-blue-700 transition-colors"
          >
            ← 返回首页
          </Link>
        </div>
      </nav>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">✍️ 投稿文章</h1>
          
          <div className="space-y-6 text-left">
            <p className="text-gray-600">
              欢迎投稿你的作品！请发送到以下邮箱：
            </p>
            
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
              <a
                href="mailto:foxmin0803@outlook.com?subject=ATEEZ甲板后厨投稿"
                className="text-2xl font-bold text-blue-600 hover:text-blue-700 break-all"
              >
                foxmin0803@outlook.com
              </a>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 text-left">
              <h3 className="font-bold text-gray-900 mb-3">📋 投稿建议</h3>
              <ul className="text-gray-700 space-y-2 text-sm">
                <li>• 邮件标题请注明：「投稿-文章标题」</li>
                <li>• 邮件内容包含：文章标题、摘要、正文</li>
                <li>• 可附上作者昵称、社交账号等信息</li>
                <li>• 如果是18+内容请特别注明</li>
                <li>• 我会在3-7天内回复你的投稿</li>
              </ul>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 text-left">
              <h3 className="font-bold text-gray-900 mb-3">📌 其他联系方式</h3>
              <ul className="text-gray-700 space-y-2 text-sm">
                <li>• 微博：@金奎闵</li>
                <li>• 小红书：@金奎闵</li>
              </ul>
            </div>
          </div>

          <a
            href="mailto:foxmin0803@outlook.com?subject=ATEEZ甲板后厨投稿"
            className="inline-block mt-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-xl font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
          >
            📧 立即发邮件
          </a>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12 mt-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="mb-2">© 2024 ATEEZ甲板后厨</p>
          <p className="text-sm">Pirate King · 分享内容</p>
        </div>
      </footer>
    </div>
  );
}
