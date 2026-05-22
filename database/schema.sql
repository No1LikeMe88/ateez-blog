-- 初始化投稿系统数据库

-- 创建待审核投稿表
CREATE TABLE IF NOT EXISTS submissions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  summary TEXT,
  author_name TEXT,
  author_contact TEXT,
  is_adult INTEGER DEFAULT 0,
  status TEXT DEFAULT 'pending',
  submitted_at TEXT DEFAULT (datetime('now', '+8 hours')),
  reviewed_at TEXT,
  reviewed_by TEXT,
  reject_reason TEXT
);

-- 创建审核日志表
CREATE TABLE IF NOT EXISTS review_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  submission_id INTEGER,
  action TEXT,
  reviewer TEXT,
  timestamp TEXT DEFAULT (datetime('now', '+8 hours')),
  notes TEXT,
  FOREIGN KEY (submission_id) REFERENCES submissions(id)
);

-- 创建管理员表（用于审核）
CREATE TABLE IF NOT EXISTS admins (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TEXT DEFAULT (datetime('now', '+8 hours'))
);

-- 插入默认管理员账户
INSERT INTO admins (username, password_hash) 
VALUES ('admin', 'pbkdf2:sha256:600000$default$placeholder');
