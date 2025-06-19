import { createSignal, For, onCleanup, onMount } from 'solid-js'

// pull in the base URL from Vite env
const API_BASE = import.meta.env.VITE_API_URL

export default function Chat() {
  const [messages, setMessages] = createSignal([])
  const [input, setInput] = createSignal('')
  const [loading, setLoading] = createSignal(false)
  const [error, setError] = createSignal(null)

  let chatWindow
  const scrollToBottom = () => {
    if (chatWindow) chatWindow.scrollTop = chatWindow.scrollHeight
  }

  const sendMessage = async () => {
    const text = input().trim()
    if (!text || loading()) return

    setMessages(msgs => [...msgs, { from: 'user', text }])
    setInput('')
    setLoading(true)
    setError(null)

    const loadingId = Date.now()
    setMessages(msgs => [
      ...msgs,
      { from: 'bot', text: '', loading: true, id: loadingId }
    ])
    setTimeout(scrollToBottom, 0)

    try {
      const res = await fetch(`${API_BASE}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text })
      })
      if (!res.ok) throw new Error('API request failed')
      const data = await res.json()

      setMessages(msgs =>
        msgs.map(msg =>
          msg.id === loadingId
            ? { from: 'bot', text: data.reply }
            : msg
        )
      )
    } catch (e) {
      setError('Failed to get response')
      setMessages(msgs => msgs.filter(msg => msg.id !== loadingId))
    } finally {
      setLoading(false)
      setTimeout(scrollToBottom, 100)
    }
  }

  onMount(() => {
    setMessages([
      { from: 'bot', text: "Hello! I'm your AI assistant. How can I help you today?" }
    ])
  })

  onCleanup(() => {
    /* nothing special */
  })

  return (
    <>
      <div ref={chatWindow} class="chat-window">
        <For each={messages()} fallback={<p>Starting conversation...</p>}>
          {msg =>
            msg.loading ? (
              <div class="message bot loading">
                <div class="loading-dot" />
                <div class="loading-dot" />
                <div class="loading-dot" />
              </div>
            ) : (
              <div class={`message ${msg.from}`}>{msg.text}</div>
            )
          }
        </For>
        {error() && <div class="message bot error">{error()}</div>}
      </div>

      <div class="input-area">
        <input
          value={input()}
          onInput={e => setInput(e.target.value)}
          onKeyPress={e => e.key === 'Enter' && sendMessage()}
          placeholder="Ask anything…"
          disabled={loading()}
        />
        <button onClick={sendMessage} disabled={loading()}>
          Send
        </button>
      </div>
    </>
  )
}
