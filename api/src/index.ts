export interface Env {
  DB: D1Database;
  ADMIN_PASSWORD: string;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;

    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    try {
      // 提交文章
      if (path === '/api/submit' && request.method === 'POST') {
        return await handleSubmit(request, env, corsHeaders);
      }

      // 获取待审核列表（需要密码）
      if (path === '/api/drafts' && request.method === 'GET') {
        return await handleGetDrafts(request, env, corsHeaders);
      }

      // 审核通过
      if (path.startsWith('/api/approve/') && request.method === 'POST') {
        return await handleApprove(request, env, corsHeaders);
      }

      // 审核拒绝
      if (path.startsWith('/api/reject/') && request.method === 'POST') {
        return await handleReject(request, env, corsHeaders);
      }

      // 删除投稿
      if (path.startsWith('/api/delete/') && request.method === 'DELETE') {
        return await handleDelete(request, env, corsHeaders);
      }

      return new Response('Not Found', { status: 404 });
    } catch (error) {
      return new Response(JSON.stringify({ error: 'Server error' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
  },
};

async function handleSubmit(
  request: Request,
  env: Env,
  corsHeaders: Record<string, string>
): Promise<Response> {
  const body = await request.json();
  const { title, content, summary, author_name, author_contact, is_adult } = body;

  if (!title || !content) {
    return new Response(
      JSON.stringify({ error: '标题和内容不能为空' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  const result = await env.DB.prepare(
    `INSERT INTO submissions (title, content, summary, author_name, author_contact, is_adult, status)
     VALUES (?, ?, ?, ?, ?, ?, 'pending')`
  )
    .bind(title, content, summary || '', author_name || '', author_contact || '', is_adult ? 1 : 0)
    .run();

  return new Response(
    JSON.stringify({
      success: true,
      message: '投稿成功！等待审核',
      id: result.meta.last_row_id
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

async function handleGetDrafts(
  request: Request,
  env: Env,
  corsHeaders: Record<string, string>
): Promise<Response> {
  const url = new URL(request.url);
  const password = url.searchParams.get('password');

  if (password !== env.ADMIN_PASSWORD) {
    return new Response(
      JSON.stringify({ error: '密码错误' }),
      { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  const { results } = await env.DB.prepare(
    'SELECT * FROM submissions WHERE status = "pending" ORDER BY submitted_at DESC'
  ).all();

  return new Response(
    JSON.stringify({ drafts: results }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

async function handleApprove(
  request: Request,
  env: Env,
  corsHeaders: Record<string, string>
): Promise<Response> {
  const url = new URL(request.url);
  const password = url.searchParams.get('password');
  const id = path.split('/').pop();

  if (password !== env.ADMIN_PASSWORD) {
    return new Response(
      JSON.stringify({ error: '密码错误' }),
      { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  await env.DB.prepare(
    'UPDATE submissions SET status = "approved", reviewed_at = datetime("now", "+8 hours") WHERE id = ?'
  )
    .bind(id)
    .run();

  return new Response(
    JSON.stringify({ success: true, message: '审核通过' }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

async function handleReject(
  request: Request,
  env: Env,
  corsHeaders: Record<string, string>
): Promise<Response> {
  const url = new URL(request.url);
  const password = url.searchParams.get('password');
  const id = path.split('/').pop();
  const body = await request.json();
  const { reason } = body;

  if (password !== env.ADMIN_PASSWORD) {
    return new Response(
      JSON.stringify({ error: '密码错误' }),
      { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  await env.DB.prepare(
    `UPDATE submissions 
     SET status = "rejected", reviewed_at = datetime("now", "+8 hours"), reject_reason = ?
     WHERE id = ?`
  )
    .bind(reason || '', id)
    .run();

  return new Response(
    JSON.stringify({ success: true, message: '已拒绝' }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

async function handleDelete(
  request: Request,
  env: Env,
  corsHeaders: Record<string, string>
): Promise<Response> {
  const url = new URL(request.url);
  const password = url.searchParams.get('password');
  const id = path.split('/').pop();

  if (password !== env.ADMIN_PASSWORD) {
    return new Response(
      JSON.stringify({ error: '密码错误' }),
      { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  await env.DB.prepare('DELETE FROM submissions WHERE id = ?').bind(id).run();

  return new Response(
    JSON.stringify({ success: true, message: '已删除' }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}
