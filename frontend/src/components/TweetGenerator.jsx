// File: src/components/TweetGenerator.jsx
import { createSignal, createResource, For, Show, onMount, createEffect } from 'solid-js';
import { Motion } from 'solid-motionone';
import DraftCard from './DraftCard';
import PostedCard from './PostedCard';
import LiquidLoader from './LiquidLoader';

const API = '/api';

export default function TweetGenerator() {
  const [topic, setTopic] = createSignal('');
  const [current, setCurrent] = createSignal(null);
  const [isEditing, setIsEditing] = createSignal(false);
  const [loadingGen, setLoadingGen] = createSignal(false);
  const [loadingAction, setLoadingAction] = createSignal(false);
  const [error, setError] = createSignal('');
  const [activeTab, setActiveTab] = createSignal('drafts');
  const [rightPanelTab, setRightPanelTab] = createSignal('settings');
  const [length, setLength] = createSignal(60);
  const [tone, setTone] = createSignal('general');
  const [includeHashtagsChecked, setIncludeHashtagsChecked] = createSignal(false);
  const [hashtagsInclude, setHashtagsInclude] = createSignal('');
  const [url, setUrl] = createSignal('');

  // Pagination state
  const [draftsPage, setDraftsPage] = createSignal(1);
  const [postedPage, setPostedPage] = createSignal(1);
  const itemsPerPage = 6;

  const [drafts, { refetch: refetchDrafts }] = createResource(
    () => fetch(`${API}/tweets?posted=false`).then(r => (r.ok ? r.json() : [])),
    { initialValue: [] }
  );
  const [posted, { refetch: refetchPosted }] = createResource(
    () => fetch(`${API}/tweets?posted=true`).then(r => (r.ok ? r.json() : [])),
    { initialValue: [] }
  );

  // Paginated data
  const paginatedDrafts = () => {
    const start = (draftsPage() - 1) * itemsPerPage;
    return drafts()?.slice(start, start + itemsPerPage) || [];
  };

  const paginatedPosted = () => {
    const start = (postedPage() - 1) * itemsPerPage;
    return posted()?.slice(start, start + itemsPerPage) || [];
  };

  // Total pages calculation
  const totalDraftPages = () => Math.ceil((drafts()?.length || 0) / itemsPerPage);
  const totalPostedPages = () => Math.ceil((posted()?.length || 0) / itemsPerPage);

  // Reset pagination when tab changes
  createEffect(() => {
    setDraftsPage(1);
    setPostedPage(1);
  });

  const wordCount = () =>
    current()?.content.trim().split(/\s+/).filter(Boolean).length || 0;

  // Auto-resize textarea
  let previewTextarea;
  const resizeTextarea = () => {
    if (previewTextarea) {
      previewTextarea.style.height = 'auto';
      previewTextarea.style.height = `${previewTextarea.scrollHeight}px`;
    }
  };

  onMount(() => {
    window.addEventListener('resize', resizeTextarea);
    return () => window.removeEventListener('resize', resizeTextarea);
  });

  const handleContentChange = (content) => {
    setCurrent({ ...current(), content });
    setTimeout(resizeTextarea, 0);
  };

  const generate = async () => {
    if (!topic().trim() || loadingGen()) return;
    setLoadingGen(true);
    setError('');
    setRightPanelTab('preview');
    try {
      const payload = {
        topic: topic().trim(),
        length: length(),
        tone: tone(),
      };

      if (includeHashtagsChecked()) {
        const list = hashtagsInclude()
          .split(',')
          .map(s => s.trim())
          .filter(Boolean);
        if (list.length) payload.hashtags_include = list;
      }

      if (url().trim()) payload.url = url().trim();

      const res = await fetch(`${API}/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error();
      const { generated } = await res.json();

      setCurrent({ topic: topic().trim(), content: generated || '' });
      setIsEditing(false);
      setTimeout(resizeTextarea, 100);
    } catch {
      setError('Failed to generate');
    } finally {
      setLoadingGen(false);
    }
  };

  const toggleEdit = () => {
    if (loadingAction()) return;
    setIsEditing(e => !e);
    setError('');
    setTimeout(resizeTextarea, 100);
  };

  const saveDraft = async () => {
    if (!current() || isEditing() || loadingAction()) return;
    setLoadingAction(true);
    try {
      const res = await fetch(`${API}/tweets`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(current()),
      });
      if (!res.ok) throw new Error();
      await res.json();
      refetchDrafts();
      setCurrent(null);
      setRightPanelTab('settings');
      setDraftsPage(1); // Reset to first page after adding new draft
    } catch {
      setError('Failed to save draft');
    } finally {
      setLoadingAction(false);
    }
  };

  const postTweet = async () => {
    if (!current() || isEditing() || loadingAction()) return;
    setLoadingAction(true);
    try {
      const res = await fetch(`${API}/posts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: current().topic,
          content: current().content,
        }),
      });
      if (!res.ok) throw new Error();
      await res.json();
      refetchDrafts();
      refetchPosted();
      setCurrent(null);
      setRightPanelTab('settings');
      setPostedPage(1); // Reset to first page after posting
    } catch {
      setError('Failed to post');
    } finally {
      setLoadingAction(false);
    }
  };

  // Pagination handlers
  const nextDraftsPage = () => {
    if (draftsPage() < totalDraftPages()) {
      setDraftsPage(p => p + 1);
    }
  };

  const prevDraftsPage = () => {
    if (draftsPage() > 1) {
      setDraftsPage(p => p - 1);
    }
  };

  const nextPostedPage = () => {
    if (postedPage() < totalPostedPages()) {
      setPostedPage(p => p + 1);
    }
  };

  const prevPostedPage = () => {
    if (postedPage() > 1) {
      setPostedPage(p => p - 1);
    }
  };

  return (
    <div class="tweet-generator">
      <div class="generator-container">
        <div class="form-pane">
          <div class="input-card redesigned">
            <div class="decorative-corner"></div>
            <div class="decorative-dots"></div>
            <h3>Create New Tweet</h3>
            <div class="input-icon">
              <svg viewBox="0 0 24 24"><path d="M4 4h16v2H4z" /></svg>
            </div>
            <div class="input-group">
              <input
                id="topic-input"
                type="text"
                placeholder=" "
                value={topic()}
                onInput={e => setTopic(e.currentTarget.value)}
                disabled={loadingGen() || loadingAction()}
                class="redesigned-input"
              />
              <label for="topic-input" class="floating-label">Enter Your Topic Here</label>
            </div>
            <button
              onClick={generate}
              disabled={!topic().trim() || loadingGen() || loadingAction()}
              class="generate-btn redesigned-btn"
            >
              {loadingGen() ? 'Generating...' : 'Generate Tweet'}
            </button>
            {error() && <div class="error">{error()}</div>}
          </div>
        </div>

        <div class="right-panel">
          <div class="panel-tabs">
            <button
              class={rightPanelTab() === 'settings' ? 'active' : ''}
              onClick={() => setRightPanelTab('settings')}
            >
              Quick Settings
            </button>
            <button
              class={rightPanelTab() === 'preview' ? 'active' : ''}
              onClick={() => setRightPanelTab('preview')}
            >
              Generated Tweet
            </button>
          </div>

          <div class="panel-content">
            <Show when={rightPanelTab() === 'settings'}>
              <div class="settings-pane">
                <h3>Customize Your Tweet</h3>
                <div class="setting">
                  <label>Tweet Length: <span class="length-value">{length()} words</span></label>
                  <div class="slider-container">
                    <input
                      type="range"
                      min="5"
                      max="100"
                      value={length()}
                      onInput={e => setLength(+e.currentTarget.value)}
                      disabled={loadingGen() || loadingAction()}
                      class="styled-slider"
                      style={{ '--value': length() }}
                    />
                  </div>
                </div>
                <div class="setting">
                  <label>Tone:</label>
                  <select
                    value={tone()}
                    onInput={e => setTone(e.currentTarget.value)}
                    disabled={loadingGen() || loadingAction()}
                  >
                    <option value="professional">Professional</option>
                    <option value="general">General</option>
                    <option value="casual">Casual</option>
                    <option value="humorous">Humorous</option>
                    <option value="inspirational">Inspirational</option>
                  </select>
                </div>
                <div class="setting">
                  <label class="checkbox-label">
                    <input
                      type="checkbox"
                      checked={includeHashtagsChecked()}
                      onInput={e => setIncludeHashtagsChecked(e.currentTarget.checked)}
                    />
                    Include hashtags
                  </label>
                  <Show when={includeHashtagsChecked()}>
                    <input
                      placeholder="e.g., tech, ai, innovation"
                      value={hashtagsInclude()}
                      onInput={e => setHashtagsInclude(e.currentTarget.value)}
                      disabled={loadingGen() || loadingAction()}
                      class="hashtags-input"
                    />
                  </Show>
                </div>
                <div class="setting">
                  <label>Include URL:</label>
                  <input
                    type="url"
                    placeholder="https://example.com"
                    value={url()}
                    onInput={e => setUrl(e.currentTarget.value)}
                    disabled={loadingGen() || loadingAction()}
                    class="url-input"
                  />
                </div>
              </div>
            </Show>

            <Show when={rightPanelTab() === 'preview'}>
              <div class="preview-pane">
                <Show when={current() || loadingGen()} fallback={
                  <Motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} class="preview-message">
                    <h3>Your Generated Tweet</h3>
                    <p>Enter a topic and generate your tweet</p>
                  </Motion.div>
                }>
                  <Show when={!loadingGen()} fallback={<LiquidLoader />}>
                    <Motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} class="tweet-card preview-card">
                      <h4>{current().topic}</h4>
                      <textarea
                        ref={previewTextarea}
                        rows="4"
                        class={`preview-content ${isEditing() ? 'edit-area' : ''}`}
                        value={current().content}
                        readOnly={!isEditing()}
                        onInput={e => handleContentChange(e.currentTarget.value)}
                      />
                      <div class="word-count">{wordCount()}/300 words</div>
                      <div class="actions">
                        <button onClick={toggleEdit} disabled={loadingAction()}>
                          {isEditing() ? 'Done' : 'Edit'}
                        </button>
                        <button onClick={saveDraft} disabled={isEditing() || loadingAction()}>
                          Save Draft
                        </button>
                        <button onClick={postTweet} disabled={isEditing() || loadingAction()}>
                          Post
                        </button>
                      </div>
                    </Motion.div>
                  </Show>
                </Show>
              </div>
            </Show>
          </div>
        </div>
      </div>

      <div class="tabs">
        <button class={activeTab() === 'drafts' ? 'active' : ''} onClick={() => setActiveTab('drafts')}>
          Drafts ({drafts()?.length})
        </button>
        <button class={activeTab() === 'posted' ? 'active' : ''} onClick={() => setActiveTab('posted')}>
          Posted ({posted()?.length})
        </button>
      </div>

      <div class="tweet-grid">
        <Show when={activeTab() === 'drafts'} fallback={
          <Show when={posted()?.length > 0} fallback={
            <Motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} class="empty-state">
              <p>No posts yet</p>
            </Motion.div>
          }>
            <For each={paginatedPosted()}>{t => <PostedCard tweet={t} />}</For>
          </Show>
        }>
          <Show when={drafts()?.length > 0} fallback={
            <Motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} class="empty-state">
              <p>No drafts found</p>
            </Motion.div>
          }>
            <For each={paginatedDrafts()}>
              {t => (
                <DraftCard
                  tweet={t}
                  refetchDrafts={refetchDrafts}
                  refetchPosted={refetchPosted}
                />
              )}
            </For>
          </Show>
        </Show>
      </div>

      {/* Pagination Controls */}
      <Show when={activeTab() === 'drafts' && totalDraftPages() > 1}>
        <div class="pagination-controls">
          <button 
            onClick={prevDraftsPage} 
            disabled={draftsPage() === 1}
            class="pagination-btn prev-btn"
          >
            &larr; Prev
          </button>
          
          <div class="page-info">
            Page {draftsPage()} of {totalDraftPages()}
          </div>
          
          <button 
            onClick={nextDraftsPage} 
            disabled={draftsPage() === totalDraftPages()}
            class="pagination-btn next-btn"
          >
            Next &rarr;
          </button>
        </div>
      </Show>

      <Show when={activeTab() === 'posted' && totalPostedPages() > 1}>
        <div class="pagination-controls">
          <button 
            onClick={prevPostedPage} 
            disabled={postedPage() === 1}
            class="pagination-btn prev-btn"
          >
            &larr; Prev
          </button>
          
          <div class="page-info">
            Page {postedPage()} of {totalPostedPages()}
          </div>
          
          <button 
            onClick={nextPostedPage} 
            disabled={postedPage() === totalPostedPages()}
            class="pagination-btn next-btn"
          >
            Next &rarr;
          </button>
        </div>
      </Show>
    </div>
  );
}