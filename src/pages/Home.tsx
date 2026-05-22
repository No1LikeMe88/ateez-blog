import { useState } from 'react';
import { Link } from 'react-router-dom';
import ArticleCard from '../components/ArticleCard';
import { articles } from '../data/articles';
import { useAuthStore } from '../hooks/useAuth';

export default function Home() {
  const { logout } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredArticles = [...articles].filter((article) => {
    if (!searchQuery) return article;
    const query = searchQuery.toLowerCase();
    return (
      article.title.toLowerCase().includes(query) ||
      article.summary.toLowerCase().includes(query)
    );
  });

  const sortedArticles = [...filteredArticles].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return 0;
  });

  return (
    <div className="min-h-screen bg-gray-50 font-serif">
      {/* Navigation */}
      <nav className="bg-white shadow-sm sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col md:flex-row gap-4 md:gap-8 items-center">
          <h2 className="text-xl font-bold text-gray-900">ATEEZ 甲板后厨</h2>
          <div className="flex-1 w-full md:max-w-md">
            <div className="relative">
              <input
                type="text"
                placeholder="搜索文章标题或内容..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 pl-10 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-serif"
              />
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                🔍
              </div>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
          <div className="flex gap-4 items-center">
            <Link
              to="/submit"
              className="text-sm bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition-colors"
            >
              ✍️ 投稿
            </Link>
            <Link
              to="/admin"
              className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              管理后台
            </Link>
            <button
              onClick={logout}
              className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              退出登录
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative h-[500px]">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ 
            backgroundImage: 'url(/hero-bg.jpg)' 
          }}
        >
          <div className="absolute inset-0 bg-black/30" />
        </div>
        <div className="relative h-full flex items-end justify-center pb-16">
          <div className="text-center">
            <h1 className="text-5xl font-light text-white drop-shadow-lg">ATEEZ甲板后厨</h1>
          </div>
        </div>
      </section>

      {/* Article List */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-3xl font-bold text-gray-900">
            {searchQuery ? `搜索结果：${searchQuery}` : '最新文章'}
          </h2>
          {searchQuery && (
            <span className="text-gray-500 font-serif">
              找到 {sortedArticles.length} 篇文章
            </span>
          )}
        </div>
        {sortedArticles.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-xl text-gray-500 font-serif mb-2">没有找到相关文章</p>
            <p className="text-gray-400 font-serif">尝试换个关键词搜索吧！</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sortedArticles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="mb-2">© 2024 ATEEZ甲板后厨</p>
          <p className="text-sm">Pirate King · 分享内容</p>
        </div>
      </footer>
    </div>
  );
}
