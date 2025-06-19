import { createResource, For } from 'solid-js'

const API_BASE = import.meta.env.VITE_API_URL

async function fetchPosts() {
  const res = await fetch(`${API_BASE}/posts`)
  if (!res.ok) throw new Error('Failed to load posts')
  return res.json()
}

export default function PostList() {
  const [posts, { refetch }] = createResource(fetchPosts)

  return (
    <>
      <div class="post-list">
        <For each={posts()} fallback={[...Array(3)].map(() => (
          <div class="post-card">
            <div
              style="
                height: 1.8rem;
                width: 80%;
                background: var(--bg-glass);
                border-radius: 4px;
                margin-bottom: 1rem;
              "
            />
            <div
              style="
                height: 4rem;
                background: var(--bg-glass);
                border-radius: 4px;
                margin-bottom: 1rem;
              "
            />
            <div
              style="
                height: 1rem;
                width: 40%;
                background: var(--bg-glass);
                border-radius: 4px;
              "
            />
          </div>
        ))}>
          {post => (
            <div class="post-card">
              <h2>{post.title}</h2>
              <p>{post.content}</p>
              <small>{new Date(post.created_at).toLocaleString()}</small>
            </div>
          )}
        </For>
      </div>
      <button class="refresh-btn" onClick={refetch}>
        Refresh Posts
      </button>
    </>
  )
}
