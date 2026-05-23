import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';

type Submission = {
  id: string;
  title: string;
  author: string;
  content: string;
  is_adult: boolean;
  contact: string | null;
  status: string;
  created_at: string;
};

export default function AdminPanel() {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);

  const ADMIN_PASSWORD = 'PirateKing8888';

  useEffect(() => {
    if (isAuthenticated) {
      fetchSubmissions();
    }
  }, [isAuthenticated]);

  const fetchSubmissions = async () => {
    setLoading(true);
    setError('');
    try {
      const { data, error } = await supabase
        .from('submissions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSubmissions(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : '获取投稿失败');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setPassword('');
    } else {
      setError('密码错误');
    }
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      const { error } = await supabase
        .from('submissions')
        .update({ status })
        .eq('id', id);

      if (error) throw error;
      await fetchSubmissions();
    } catch (err) {
      setError(err instanceof Error ? err.message : '更新状态失败');
    }
  };

  const deleteSubmission = async (id: string) => {
    if (!confirm('确定要删除这个投稿吗？')) return;
    try {
      const { error } = await supabase
        .from('submissions')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await fetchSubmissions();
    } catch (err) {
      setError(err instanceof Error ? err.message : '删除失败');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('zh-CN');
  };

  const copyToClipboard = async (submission: Submission) => {
    const content = `标题：${submission.title}
作者：${submission.author}
${submission.is_adult ? '⚠️ 18+内容\n' : ''}正文：
${submission.content}
${submission.contact ? `\n联系方式：${submission.contact}` : ''}`;

    try {
      await navigator.clipboard.writeText(content);
      alert('✅ 已复制到剪贴板！');
    } catch (err) {
      alert('复制失败，请手动复制');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 font-serif flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full mx-4">
          <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">🔐 管理后台登录</h1>
          
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6">
              {error}
            </div>
          )}
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-gray-700 font-medium mb-2">管理员密码</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="请输入密码"
              />
            </div>
            
            <div className="flex gap-3">
              <Link
                to="/"
                className="flex-1 bg-gray-100 text-gray-700 px-4 py-3 rounded-xl font-medium hover:bg-gray-200 transition-colors text-center"
              >
                返回首页
              </Link>
              <button
                type="submit"
                className="flex-1 bg-blue-600 text-white px-4 py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors"
              >
                登录
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-serif">
      <nav className="bg-white shadow-sm sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900">📊 管理后台</h2>
          <div className="flex items-center gap-4">
            <button
              onClick={fetchSubmissions}
              className="text-sm text-blue-600 hover:text-blue-700 transition-colors"
            >
              🔄 刷新
            </button>
            <Link
              to="/"
              className="text-sm text-blue-600 hover:text-blue-700 transition-colors"
            >
              ← 返回首页
            </Link>
            <button
              onClick={() => setIsAuthenticated(false)}
              className="text-sm text-red-600 hover:text-red-700 transition-colors"
            >
              退出
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl mb-6">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">加载中...</p>
          </div>
        ) : selectedSubmission ? (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{selectedSubmission.title}</h1>
                <p className="text-gray-600 mt-2">作者：{selectedSubmission.author}</p>
                <p className="text-gray-500 text-sm mt-1">{formatDate(selectedSubmission.created_at)}</p>
                {selectedSubmission.is_adult && (
                  <span className="inline-block mt-2 bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm">
                    🔞 18+
                  </span>
                )}
              </div>
              <button
                onClick={() => setSelectedSubmission(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div className="bg-gray-50 rounded-xl p-6 mb-6 whitespace-pre-wrap">
              {selectedSubmission.content}
            </div>

            {selectedSubmission.contact && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
                <p className="text-gray-700"><strong>联系方式：</strong>{selectedSubmission.contact}</p>
              </div>
            )}

            <div className="flex gap-3 flex-wrap">
              <button
                onClick={() => copyToClipboard(selectedSubmission)}
                className="px-4 py-2 rounded-lg font-medium bg-purple-600 text-white hover:bg-purple-700 transition-colors"
              >
                📋 一键复制全部内容
              </button>
              <button
                onClick={() => updateStatus(selectedSubmission.id, 'approved')}
                className={`px-4 py-2 rounded-lg font-medium ${
                  selectedSubmission.status === 'approved'
                    ? 'bg-green-600 text-white'
                    : 'bg-green-100 text-green-700 hover:bg-green-200'
                }`}
              >
                ✓ 已采纳
              </button>
              <button
                onClick={() => updateStatus(selectedSubmission.id, 'rejected')}
                className={`px-4 py-2 rounded-lg font-medium ${
                  selectedSubmission.status === 'rejected'
                    ? 'bg-red-600 text-white'
                    : 'bg-red-100 text-red-700 hover:bg-red-200'
                }`}
              >
                ✗ 已拒绝
              </button>
              <button
                onClick={() => deleteSubmission(selectedSubmission.id)}
                className="px-4 py-2 rounded-lg font-medium bg-gray-100 text-gray-700 hover:bg-gray-200"
              >
                🗑️ 删除
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">标题</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">作者</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">状态</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">时间</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {submissions.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                        暂无投稿
                      </td>
                    </tr>
                  ) : (
                    submissions.map((submission) => (
                      <tr key={submission.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <span className="text-gray-900">{submission.title}</span>
                            {submission.is_adult && (
                              <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded text-xs">18+</span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-600">{submission.author}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                            submission.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : submission.status === 'approved'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {submission.status === 'pending' ? '待审核' : submission.status === 'approved' ? '已采纳' : '已拒绝'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-600 text-sm">
                          {formatDate(submission.created_at)}
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => setSelectedSubmission(submission)}
                            className="text-blue-600 hover:text-blue-700 font-medium"
                          >
                            查看详情
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      <footer className="bg-gray-900 text-gray-400 py-12 mt-16">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="mb-2">© 2024 ATEEZ甲板后厨</p>
          <p className="text-sm">Pirate King · 分享内容</p>
        </div>
      </footer>
    </div>
  );
}
