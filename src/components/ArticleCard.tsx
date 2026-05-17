import { Link } from 'react-router-dom';
import { Article } from '../types/article';

interface ArticleCardProps {
  article: Article;
}

const ArticleCard = ({ article }: ArticleCardProps) => {
  return (
    <Link 
      to={`/article/${article.id}`}
      className="group block bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
    >
      {article.coverImage && (
        <div className="relative h-48 overflow-hidden">
          <img 
            src={article.coverImage} 
            alt={article.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      )}
      <div className="p-6 font-serif">
        <div className="flex items-center gap-3 text-sm text-gray-500 mb-3">
          <span>{article.publishDate}</span>
          <span>·</span>
          <span>{article.readTime}</span>
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-700 transition-colors font-serif">
          {article.title}
          {article.isAdult && (
            <span className="text-xs text-red-600 ml-2 font-serif">18+</span>
          )}
        </h3>
        <p className="text-gray-600 line-clamp-2">
          {article.summary}
        </p>
      </div>
    </Link>
  );
};

export default ArticleCard;
