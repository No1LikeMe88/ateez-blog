import { useState } from 'react';
import { useAuthStore, checkPassword } from '../hooks/useAuth';

const PasswordPage = () => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { authenticate } = useAuthStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (checkPassword(password)) {
      authenticate();
    } else {
      setError('密码错误，请再试一次');
      setPassword('');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-serif font-bold text-slate-900 mb-2">ATEEZ 甲板后厨</h1>
          <p className="text-slate-500">请输入密码以继续</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="输入密码..."
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              autoFocus
            />
          </div>
          
          {error && (
            <p className="text-red-500 text-sm text-center">{error}</p>
          )}
          
          <button
            type="submit"
            className="w-full bg-slate-800 text-white py-3 rounded-lg font-medium hover:bg-slate-700 transition-colors"
          >
            进入网站
          </button>
        </form>
        
        <div className="mt-6 text-center text-sm text-slate-400">
          <p>默认密码：ateez123</p>
        </div>
      </div>
    </div>
  );
};

export default PasswordPage;
