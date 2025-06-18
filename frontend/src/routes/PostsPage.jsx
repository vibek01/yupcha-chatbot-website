// src/routes/PostsPage.jsx (updated)
import PostList from '../components/PostList';

export default function PostsPage() {
  return (
    <>
      <div class="posts-header glass">
        <h1>AI Insights</h1>
        <p>Latest research and developments</p>
      </div>
      <PostList />
    </>
  );
}