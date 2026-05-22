import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function SubmitArticle() {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    summary: '',
    author_name: '',
    author_contact: '',
    is_adult: false,
  });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');

    try {
      const response = await fetch('https://ateez-blog-api.your-account.workers.dev/api/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus('success');
        setMessage('投稿成功！你的文章将在审核后显示在网站上。');
        setFormData({
          title: '',
          content: '',
          summary: '',
          author_name: '',
          author_contact: '',
          is_adult: false,
        });
      } else {
        setStatus('error');
        setMessage(data.error || '投稿失败，请重试');
      }
    } catch (error) {
      setStatus('error');
      setMessage('网络错误，请重试');
    }
  };

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

      {/* Form Section */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">✍️ 投稿文章</h1>
            <p className="text-gray-600">欢迎投稿！你的文章将在审核后发布</p>
          </div>

          {status === 'success' && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl">
              <p className="text-green-700 font-medium">✅ {message}</p>
            </div>
          )}

          {status === 'error' && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-red-700 font-medium">❌ {message}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 标题 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                文章标题 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="请输入文章标题"
              />
            </div>

            {/* 摘要 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                文章摘要
              </label>
              <input
                type="text"
                value={formData.summary}
                onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="简要描述文章内容（可选）"
              />
            </div>

            {/* 内容 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                文章内容 <span className="text-red-500">*</span>
              </label>
              <textarea
                required
                rows={15}
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent font-serif"
                placeholder="请输入文章内容，支持HTML格式"
              />
            </div>

            {/* 18+ 标记 */}
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="is_adult"
                checked={formData.is_adult}
                onChange={(e) => setFormData({ ...formData, is_adult: e.target.checked })}
                className="w-5 h-5 text-red-600 rounded focus:ring-red-500"
              />
              <label htmlFor="is_adult" className="text-sm text-gray-700">
                ⚠️ 此文章包含18+内容
              </label>
            </div>

            <hr className="border-gray-200" />

            {/* 作者信息 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  作者名称
                </label>
                <input
                  type="text"
                  value={formData.author_name}
                  onChange={(e) => setFormData({ ...formData, author_name: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="你的昵称（可选）"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  联系方式
                </label>
                <input
                  type="text"
                  value={formData.author_contact}
                  onChange={(e) => setFormData({ ...formData, author_contact: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="微博/小红书/邮箱（可选）"
                />
              </div>
            </div>

            {/* 提交按钮 */}
            <button
              type="submit"
              disabled={status === 'submitting'}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6 rounded-xl font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {status === 'submitting' ? '提交中...' : '提交投稿'}
            </button>
          </form>

          {/* 提示 */}
          <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
            <p className="text-sm text-yellow-800">
              💡 <strong>投稿须知：</strong>
            </p>
            <ul className="mt-2 text-sm text-yellow-700 space-y-1">
              <li>• 请确保文章为原创或已获得授权</li>
              <li>• 请勿投稿违反法律法规的内容</li>
              <li>• 18+内容需在标题标注【XXM】</li>
              <li>• 审核结果会通过联系方式通知（如果填写）</li>
            </ul>
          </div>
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
