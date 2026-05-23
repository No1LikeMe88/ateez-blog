import { useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function SubmitArticle() {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    content: '',
    isAdult: false,
    contact: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    setSubmitSuccess(false);

    try {
      const { error } = await supabase.from('submissions').insert({
        title: formData.title,
        author: formData.author || '匿名',
        content: formData.content,
        is_adult: formData.isAdult,
        contact: formData.contact,
        status: 'pending',
      });

      if (error) throw error;

      setSubmitSuccess(true);
      setFormData({
        title: '',
        author: '',
        content: '',
        isAdult: false,
        contact: '',
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : '投稿失败，请稍后重试');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const target = e.target as HTMLInputElement;
    const { name, value, type } = target;
    const checked = type === 'checkbox' ? target.checked : false;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
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

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">✍️ 投稿文章</h1>
          
          {submitSuccess ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🎉</div>
              <h2 className="text-2xl font-bold text-green-600 mb-4">投稿成功！</h2>
              <p className="text-gray-600 mb-6">感谢你的投稿，我会尽快审核并回复你。</p>
              <Link
                to="/"
                className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-xl font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
              >
                返回首页
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-gray-700 font-medium mb-2">文章标题 *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="请输入文章标题"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">作者昵称</label>
                <input
                  type="text"
                  name="author"
                  value={formData.author}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="留空则显示为匿名"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">文章内容 *</label>
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  required
                  rows={12}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y"
                  placeholder="请在这里输入文章内容..."
                />
              </div>

              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  name="isAdult"
                  id="isAdult"
                  checked={formData.isAdult}
                  onChange={handleChange}
                  className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                />
                <label htmlFor="isAdult" className="text-gray-700 font-medium">
                  🔞 这是18+内容
                </label>
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">联系方式</label>
                <input
                  type="text"
                  name="contact"
                  value={formData.contact}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="邮箱、微博、小红书等（可选，用于回复）"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? '提交中...' : '📤 提交投稿'}
              </button>
            </form>
          )}
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
