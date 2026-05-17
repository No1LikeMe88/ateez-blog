import ArticleCard from '../components/ArticleCard';
import { articles } from '../data/articles';
import { useAuthStore } from '../hooks/useAuth';

export default function Home() {
  const { logout } = useAuthStore();

  return (
    <div className="min-h-screen bg-gray-50 font-serif">
      {/* Navigation */}
      <nav className="bg-white shadow-sm sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900">ATEEZ 甲板后厨</h2>
          <button
            onClick={logout}
            className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            退出登录
          </button>
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
        <h2 className="text-3xl font-bold text-gray-900 mb-10">最新文章</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...articles].sort((a, b) => {
            if (a.isPinned && !b.isPinned) return -1;
            if (!a.isPinned && b.isPinned) return 1;
            return 0;
          }).map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
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
