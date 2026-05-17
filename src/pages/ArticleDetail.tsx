
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getArticleById } from '../data/articles';
import { ArrowLeft } from 'lucide-react';

const ArticleDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const article = id ? getArticleById(id) : undefined;
  const showAdultBadge = article?.isAdult || (article?.title.includes('M】') ?? false);

  if (!article) {
    return (
      <div className="min-h-screen flex items-center justify-center font-serif">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">文章未找到</h1>
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            返回首页
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-serif">
      {/* Navigation */}
      <nav className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>返回</span>
          </button>
        </div>
      </nav>

      {/* Article Content */}
      <article className="max-w-4xl mx-auto px-4 py-12">
        <header className="mb-8">
          <div className="flex items-center gap-3 text-sm text-gray-500 mb-4">
            <span>{article.publishDate}</span>
            <span>·</span>
            <span>{article.readTime}</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-6 font-serif">
            {article.title}
            {showAdultBadge && (
              <span className="text-base text-red-600 ml-3 font-serif">18+</span>
            )}
          </h1>
          <div className="h-72 rounded-xl overflow-hidden">
            <img 
              src={article.coverImage} 
              alt={article.title}
              className="w-full h-full object-cover"
            />
          </div>
        </header>

        <div 
          className="prose prose-lg max-w-none text-gray-700"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />
      </article>
    </div>
  );
};

export default ArticleDetail;
