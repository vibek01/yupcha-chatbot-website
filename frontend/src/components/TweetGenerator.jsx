// File: src/components/TweetGenerator.jsx (Final Version with Auto-Scroll)
import { createSignal, createResource, For, Show, onMount, createEffect } from 'solid-js';
import { Motion } from 'solid-motionone';
import DraftCard from './DraftCard';
import PostedCard from './PostedCard';
import LiquidLoader from './LiquidLoader';
import '../styles/tweet-generator-new.css'; 

// API URL from environment variables
const API = import.meta.env.VITE_API_URL;

export default function TweetGenerator() {
  // --- STATE AND LOGIC ---
  const [topic, setTopic] = createSignal('');
  const [current, setCurrent] = createSignal(null);
  const [isEditing, setIsEditing] = createSignal(false);
  const [loadingGen, setLoadingGen] = createSignal(false);
  const [loadingAction, setLoadingAction] = createSignal(false);
  const [error, setError] = createSignal('');
  const [activeTab, setActiveTab] = createSignal('drafts');
  const [length, setLength] = createSignal(60);
  const [tone, setTone] = createSignal('general');
  const [includeHashtagsChecked, setIncludeHashtagsChecked] = createSignal(false);
  const [hashtagsInclude, setHashtagsInclude] = createSignal('');
  const [url, setUrl] = createSignal('');
  const [draftsPage, setDraftsPage] = createSignal(1);
  const [postedPage, setPostedPage] = createSignal(1);
  const itemsPerPage = 6;
  const [showSettings, setShowSettings] = createSignal(false);

  // --- NEW: A reference to the results area div ---
  let resultAreaRef;

  // --- RESOURCE FETCHING ---
  const [drafts, { refetch: refetchDrafts }] = createResource(
    () => fetch(`${API}/tweets?posted=false`).then(r => (r.ok ? r.json() : [])),
    { initialValue: [] }
  );
  const [posted, { refetch: refetchPosted }] = createResource(
    () => fetch(`${API}/tweets?posted=true`).then(r => (r.ok ? r.json() : [])),
    { initialValue: [] }
  );

  // --- HELPER FUNCTIONS ---
  const paginatedDrafts = () => {
    const start = (draftsPage() - 1) * itemsPerPage;
    return drafts()?.slice(start, start + itemsPerPage) || [];
  };
  const paginatedPosted = () => {
    const start = (postedPage() - 1) * itemsPerPage;
    return posted()?.slice(start, start + itemsPerPage) || [];
  };
  const totalDraftPages = () => Math.ceil((drafts()?.length || 0) / itemsPerPage);
  const totalPostedPages = () => Math.ceil((posted()?.length || 0) / itemsPerPage);

  createEffect(() => {
    setDraftsPage(1);
    setPostedPage(1);
  });

  const wordCount = () =>
    current()?.content.trim().split(/\s+/).filter(Boolean).length || 0;

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
  const handleContentChange = content => {
    setCurrent({ ...current(), content });
    setTimeout(resizeTextarea, 0);
  };

  // --- API FUNCTIONS (with scrolling) ---
  const generate = async () => {
    if (!topic().trim() || loadingGen()) return;

    // NEW: Scroll the results area into view when generation starts
    resultAreaRef?.scrollIntoView({ behavior: 'smooth', block: 'center' });

    setLoadingGen(true);
    setError('');
    setCurrent(null);
    try {
      const payload = {
        topic: topic().trim(),
        length: length(),
        tone: tone(),
      };
      if (includeHashtagsChecked()) {
        const list = hashtagsInclude().split(',').map(s => s.trim()).filter(Boolean);
        if (list.length) payload.hashtags_include = list;
      }
      if (url().trim()) payload.url = url().trim();

      const res = await fetch(`${API}/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const errText = await res.text();
        throw new Error(errText || 'Failed to generate response from server.');
      }
      const { generated } = await res.json();
      setCurrent({ topic: topic().trim(), content: generated || '' });
      setIsEditing(false);
      setTimeout(resizeTextarea, 100);
    } catch (e) {
      setError(e.message);
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
      setDraftsPage(1);
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
        body: JSON.stringify({ title: current().topic, content: current().content }),
      });
      if (!res.ok) throw new Error();
      await res.json();
      refetchDrafts();
      refetchPosted();
      setCurrent(null);
      setPostedPage(1);
    } catch {
      setError('Failed to post');
    } finally {
      setLoadingAction(false);
    }
  };

  const nextDraftsPage = () => { if (draftsPage() < totalDraftPages()) setDraftsPage(p => p + 1); };
  const prevDraftsPage = () => { if (draftsPage() > 1) setDraftsPage(p => p - 1); };
  const nextPostedPage = () => { if (postedPage() < totalPostedPages()) setPostedPage(p => p + 1); };
  const prevPostedPage = () => { if (postedPage() > 1) setPostedPage(p => p - 1); };


  // --- JSX STRUCTURE ---
  return (
    <div class="tweet-generator-layout">
      <section class="generator-main">
        <div class="generator-header">
          <h1>AI TWEET GENERATOR</h1>
          <p>Craft the perfect tweet in seconds. Just enter your topic, customize the settings, and let the AI do the rest.</p>
        </div>

        <div class="generator-card">
          <div class="topic-input-wrapper">
            <input
              id="topic-input"
              type="text"
              placeholder="e.g., The future of renewable energy"
              value={topic()}
              onInput={e => setTopic(e.currentTarget.value)}
              disabled={loadingGen() || loadingAction()}
            />
            <button
              onClick={generate}
              disabled={!topic().trim() || loadingGen() || loadingAction()}
              class="generate-btn"
            >
              Generate
            </button>
          </div>

          <div class="settings-control">
            <button 
              class="settings-toggle" 
              onClick={() => setShowSettings(!showSettings())}
              aria-expanded={showSettings()}
            >
              <svg viewBox="0 0 24 24"><path d="M12 15.5A3.5 3.5 0 0 1 8.5 12A3.5 3.5 0 0 1 12 8.5a3.5 3.5 0 0 1 3.5 3.5a3.5 3.5 0 0 1-3.5 3.5m7.43-2.53c.04-.32.07-.64.07-.97c0-.33-.03-.66-.07-1l2.11-1.65c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.3-.61-.22l-2.49 1c-.52-.4-1.08-.73-1.69-.98l-.38-2.65C14.46 2.18 14.25 2 14 2h-4c-.25 0-.46.18-.49.42l-.38 2.65c-.61.25-1.17.59-1.69.98l-2.49-1c-.23-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64L4.57 11c-.04.34-.07.67-.07 1c0 .33.03.63.07.97l-2.11 1.65c-.19-.15-.24.42-.12-.64l2 3.46c.12.22.39.3.61.22l2.49-1c.52.4 1.08.73 1.69.98l.38 2.65c.03.24.24.42.49.42h4c.25 0 .46-.18.49-.42l.38-2.65c.61-.25 1.17-.59 1.69-.98l2.49 1c.23.09.49 0 .61.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.65Z"></path></svg>
              <span>Customize</span>
            </button>
          </div>

          <div class={`settings-drawer-wrapper ${!showSettings() ? 'collapsed' : ''}`}>
            <div class="settings-drawer">
              <div class="setting-grid">
                <div class="setting">
                  <label>Tweet Length: <span class="length-value">{length()} words</span></label>
                  <input type="range" min="10" max="100" value={length()} onInput={e => setLength(+e.currentTarget.value)} class="styled-slider" />
                </div>
                <div class="setting">
                  <label>Tone</label>
                  <select value={tone()} onInput={e => setTone(e.currentTarget.value)}>
                    <option value="professional">Professional</option>
                    <option value="general">General</option>
                    <option value="casual">Casual</option>
                    <option value="humorous">Humorous</option>
                  </select>
                </div>
                <div class="setting">
                  <label>Include URL</label>
                  <input type="url" placeholder="https://example.com" value={url()} onInput={e => setUrl(e.currentTarget.value)} class="url-input" />
                </div>
                <div class="setting full-width">
                  <label class="checkbox-label">
                    <input type="checkbox" checked={includeHashtagsChecked()} onInput={e => setIncludeHashtagsChecked(e.currentTarget.checked)} />
                    Include custom hashtags (comma-separated)
                  </label>
                  <Show when={includeHashtagsChecked()}>
                    <input class="hashtags-input" placeholder="e.g., tech, ai, innovation" value={hashtagsInclude()} onInput={e => setHashtagsInclude(e.currentTarget.value)} />
                  </Show>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* --- NEW: Attach the ref to this div --- */}
        <div class="result-area" ref={resultAreaRef}>
          <Show when={loadingGen()} fallback={
            <Show when={current()} fallback={
              <div class="preview-placeholder">
                <svg viewBox="0 0 24 24"><path d="m14.4 6l-.24-1.2c-.11-.55-.63-1-1.2-1H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9-2-2V8c0-1.1-.9-2-2-2h-5.6M18 13l-4 4l-4-4m4 4V9"></path></svg>
                <p>Your generated tweet will appear here.</p>
              </div>
            }>
              <Motion.div class="preview-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <div class="preview-header">
                  <h4>Generated Tweet</h4>
                  <div class="word-count">{wordCount()} words</div>
                </div>
                <textarea
                  ref={previewTextarea}
                  class={`preview-content ${isEditing() ? 'editing' : ''}`}
                  value={current().content}
                  readOnly={!isEditing()}
                  onInput={e => handleContentChange(e.currentTarget.value)}
                />
                <div class="preview-actions">
                  <button onClick={toggleEdit} class="action-btn edit" disabled={loadingAction()}>
                    {isEditing() ? 'Lock In' : 'Edit'}
                  </button>
                  <button onClick={saveDraft} class="action-btn save" disabled={isEditing() || loadingAction()}>
                    Save as Draft
                  </button>
                  <button onClick={postTweet} class="action-btn post" disabled={isEditing() || loadingAction()}>
                    Post Now
                  </button>
                </div>
              </Motion.div>
            </Show>
          }>
            <LiquidLoader />
          </Show>
          {error() && <div class="error-message">{error()}</div>}
        </div>
      </section>

      <div class="tabs">
        <button class={activeTab() === 'drafts' ? 'active' : ''} onClick={() => setActiveTab('drafts')}>
          Drafts ({drafts()?.length || 0})
        </button>
        <button class={activeTab() === 'posted' ? 'active' : ''} onClick={() => setActiveTab('posted')}>
          Posted ({posted()?.length || 0})
        </button>
      </div>

      <div class="tweet-grid">
        <Show when={activeTab() === 'drafts'} fallback={
          <Show when={paginatedPosted().length > 0} fallback={<div class="empty-state"><p>No posted tweets yet.</p></div>}>
            <For each={paginatedPosted()}>{t => <PostedCard tweet={t} />}</For>
          </Show>
        }>
          <Show when={paginatedDrafts().length > 0} fallback={<div class="empty-state"><p>No drafts saved.</p></div>}>
            <For each={paginatedDrafts()}>{t => <DraftCard tweet={t} refetchDrafts={refetchDrafts} refetchPosted={refetchPosted} />}</For>
          </Show>
        </Show>
      </div>

      <Show when={activeTab() === 'drafts' && totalDraftPages() > 1}>
        <div class="pagination-controls">
          <button onClick={prevDraftsPage} disabled={draftsPage() === 1}>&larr; Prev</button>
          <span>Page {draftsPage()} of {totalDraftPages()}</span>
          <button onClick={nextDraftsPage} disabled={draftsPage() === totalDraftPages()}>Next &rarr;</button>
        </div>
      </Show>

      <Show when={activeTab() === 'posted' && totalPostedPages() > 1}>
        <div class="pagination-controls">
          <button onClick={prevPostedPage} disabled={postedPage() === 1}>&larr; Prev</button>
          <span>Page {postedPage()} of {totalPostedPages()}</span>
          <button onClick={nextPostedPage} disabled={postedPage() === totalPostedPages()}>Next &rarr;</button>
        </div>
      </Show>
    </div>
  );
}