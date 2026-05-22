import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "@/pages/Home";
import ArticleDetail from "@/pages/ArticleDetail";
import PasswordPage from "@/pages/PasswordPage";
import SubmitArticle from "@/pages/SubmitArticle";
import AdminPanel from "@/pages/AdminPanel";
import NoticeModal from "@/components/NoticeModal";
import { useAuthStore } from "@/hooks/useAuth";

export default function App() {
  const { isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return <PasswordPage />;
  }

  return (
    <>
      <NoticeModal />
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/article/:id" element={<ArticleDetail />} />
          <Route path="/submit" element={<SubmitArticle />} />
          <Route path="/admin" element={<AdminPanel />} />
        </Routes>
      </Router>
    </>
  );
}
