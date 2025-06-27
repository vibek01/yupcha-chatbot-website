// File: src/components/DraftCard.jsx
import { createSignal, Show } from 'solid-js';
import { Motion } from 'solid-motionone';

const API = import.meta.env.VITE_API_URL;

export default function DraftCard(props) {
  const { tweet, refetchDrafts, refetchPosted } = props;
  const [editing, setEditing] = createSignal(false);
  const [content, setContent] = createSignal(tweet.content);
  const [loading, setLoading] = createSignal(false);
  const [error, setError] = createSignal('');
  let cardRef;

  const title = tweet.topic.split(' ').slice(0, 5).join(' ');

  const handleMouseMove = e => {
    if (!cardRef) return;
    const rect = cardRef.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    cardRef.style.setProperty('--mouse-x', `${x}px`);
    cardRef.style.setProperty('--mouse-y', `${y}px`);
  };

  const toggleEdit = () => {
    if (loading()) return;
    setEditing(e => !e);
    setError('');
  };

  const save = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API}/tweets/${tweet.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: tweet.topic,
          content: content().trim(),
        }),
      });
      if (!res.ok) throw new Error();
      await res.json();
      refetchDrafts();
      setEditing(false);
    } catch {
      setError('Save failed');
    } finally {
      setLoading(false);
    }
  };

  const post = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API}/posts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: tweet.topic,
          content: content().trim(),
        }),
      });
      if (!res.ok) throw new Error();
      await res.json();
      refetchDrafts();
      refetchPosted();
    } catch {
      setError('Post failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Motion.div
      ref={cardRef}
      class="card draft-card"
      onMouseMove={handleMouseMove}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, scale: 1.02 }}
      transition={{ duration: 0.3 }}
    >
      <div class="card-content">
        <div class="card-content-background">
          <div class="card-header">
            <div class="card-title">{title}</div>
            <div class="status-chip draft-chip">Draft</div>
          </div>

          <div class="card-content-inner">
            <Show
              when={!editing()}
              fallback={
                <textarea
                  rows="4"
                  class="edit-area"
                  value={content()}
                  onInput={e => setContent(e.currentTarget.value)}
                />
              }
            >
              <p class="posted-content">{content()}</p>
            </Show>
          </div>

          {error() && <div class="error">{error()}</div>}

          <div class="card-footer">
            <div>Created: {new Date(tweet.created_at).toLocaleDateString()}</div>
            <div>{content().trim().split(/\s+/).filter(Boolean).length} words</div>
          </div>

          <div class="card-actions">
            <button
              onClick={editing() ? save : toggleEdit}
              disabled={loading()}
              class="edit-btn"
            >
              {editing() ? 'Save' : 'Edit'}
            </button>
            <button
              onClick={post}
              disabled={editing() || loading()}
              class="post-btn"
            >
              Post
            </button>
          </div>
        </div>
      </div>
    </Motion.div>
  );
}
