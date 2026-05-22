import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

interface Draft {
  id: number;
  title: string;
  content: string;
  summary: string;
  author_name: string;
  author_contact: string;
  is_adult: number;
  submitted_at: string;
}

export default function AdminPanel() {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedDraft, setSelectedDraft] = useState<Draft | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  const API_URL = 'https://ateez-blog-api.your-account.workers.dev';

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/drafts?password=${password}`);
      const data = await response.json();

      if (response.ok) {
        setIsAuthenticated(true);
        setDrafts(data.drafts || []);
      } else {
        alert(data.error || '密码错误');
      }
    } catch (error) {
      alert('连接失败，请检查网络');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: number) => {
    if (!confirm('确认通过此投稿？')) return;

    try {
      const response = await fetch(`${API_URL}/api/approve/${id}?password=${password}`, {
        method: 'POST',
      });

      if (response.ok) {
        setDrafts(drafts.filter((d) => d.id !== id));
        setSelectedDraft(null);
        alert('审核通过！');
      } else {
        alert('操作失败');
      }
    } catch (error) {
      alert('操作失败');
    }
  };

  const handleReject = async (id: number) => {
    if (!rejectReason.trim()) {
      alert('请输入拒绝原因');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/reject/${id}?password=${password}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: rejectReason }),
      });

      if (response.ok) {
        setDrafts(drafts.filter((d) => d.id !== id));
        setSelectedDraft(null);
        setRejectReason('');
        alert('已拒绝');
      } else {
        alert('操作失败');
      }
    } catch (error) {
      alert('操作失败');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('确认删除此投稿？')) return;

    try {
      const response = await fetch(`${API_URL}/api/delete/${id}?password=${password}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setDrafts(drafts.filter((d) => d.id !== id));
        setSelectedDraft(null);
        alert('已删除');
      } else {
        alert('操作失败');
      }
    } catch (error) {
      alert('操作失败');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
          <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">🔐 管理后台</h1>
          <form onSubmit={handleLogin}>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                管理密码
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="请输入管理密码"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-xl font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-300 disabled:opacity-50"
            >
              {loading ? '验证中...' : '登录'}
            </button>
          </form>
          <div className="mt-6 text-center">
            <Link to="/" className="text-sm text-blue-600 hover:text-blue-700">
              ← 返回首页
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-serif">
      {/* Navigation */}
      <nav className="bg-white shadow-sm sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900">📋 投稿审核后台</h2>
          <div className="flex gap-4">
            <button
              onClick={() => setIsAuthenticated(false)}
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              退出
            </button>
            <Link to="/" className="text-sm text-blue-600 hover:text-blue-700">
              返回首页
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 左侧：待审核列表 */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              待审核投稿 ({drafts.length})
            </h3>

            {drafts.length === 0 ? (
              <p className="text-gray-500 text-center py-12">暂无待审核的投稿</p>
            ) : (
              <div className="space-y-4">
                {drafts.map((draft) => (
                  <div
                    key={draft.id}
                    onClick={() => setSelectedDraft(draft)}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      selectedDraft?.id === draft.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <h4 className="font-bold text-gray-900 mb-2">
                      {draft.is_adult === 1 && '⚠️ '}{draft.title}
                    </h4>
                    <p className="text-sm text-gray-600 mb-2">
                      {draft.summary || '无摘要'}
                    </p>
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>作者：{draft.author_name || '匿名'}</span>
                      <span>{new Date(draft.submitted_at).toLocaleString('zh-CN')}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 右侧：文章详情和操作 */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">文章详情</h3>

            {selectedDraft ? (
              <>
                <div className="mb-6">
                  <h4 className="text-lg font-bold text-gray-900 mb-2">
                    {selectedDraft.is_adult === 1 && '⚠️ '}{selectedDraft.title}
                  </h4>
                  <div className="text-sm text-gray-600 space-y-1 mb-4">
                    <p>作者：{selectedDraft.author_name || '匿名'}</p>
                    <p>联系方式：{selectedDraft.author_contact || '未填写'}</p>
                    <p>投稿时间：{new Date(selectedDraft.submitted_at).toLocaleString('zh-CN')}</p>
                    {selectedDraft.is_adult === 1 && (
                      <p className="text-red-600 font-medium">⚠️ 包含18+内容</p>
                    )}
                  </div>
                </div>

                <div className="mb-6">
                  <h5 className="font-medium text-gray-700 mb-2">摘要：</h5>
                  <p className="text-gray-600 text-sm mb-4">
                    {selectedDraft.summary || '无'}
                  </p>
                </div>

                <div className="mb-6">
                  <h5 className="font-medium text-gray-700 mb-2">内容预览：</h5>
                  <div
                    className="bg-gray-50 p-4 rounded-xl text-sm text-gray-700 max-h-64 overflow-y-auto"
                    dangerouslySetInnerHTML={{ __html: selectedDraft.content }}
                  />
                </div>

                <hr className="my-6" />

                {/* 操作按钮 */}
                <div className="space-y-4">
                  <button
                    onClick={() => handleApprove(selectedDraft.id)}
                    className="w-full bg-green-600 text-white py-3 px-4 rounded-xl font-medium hover:bg-green-700 transition-colors"
                  >
                    ✅ 通过审核
                  </button>

                  <div className="space-y-2">
                    <input
                      type="text"
                      value={rejectReason}
                      onChange={(e) => setRejectReason(e.target.value)}
                      placeholder="拒绝原因（必填）"
                      className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                    <button
                      onClick={() => handleReject(selectedDraft.id)}
                      disabled={!rejectReason.trim()}
                      className="w-full bg-red-600 text-white py-3 px-4 rounded-xl font-medium hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      ❌ 拒绝投稿
                    </button>
                  </div>

                  <button
                    onClick={() => handleDelete(selectedDraft.id)}
                    className="w-full bg-gray-600 text-white py-2 px-4 rounded-xl font-medium hover:bg-gray-700 transition-colors"
                  >
                    🗑️ 直接删除
                  </button>
                </div>
              </>
            ) : (
              <p className="text-gray-500 text-center py-12">
                点击左侧列表查看文章详情
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12 mt-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="mb-2">© 2024 ATEEZ甲板后厨</p>
          <p className="text-sm">Pirate King · 分享内容</p>
        </div>
      </footer>
    </div>
  );
}
