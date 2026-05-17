
export interface Article {
  id: string;
  title: string;
  summary: string;
  content: string;
  coverImage: string;
  publishDate: string;
  readTime: string;
  isAdult?: boolean;
  isPinned?: boolean;
}
