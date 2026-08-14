const form = document.querySelector('#chatForm')
const input = document.querySelector('#chatInput')
const messages = document.querySelector('#chatMessages')
const submitButton = form?.querySelector('button[type="submit"]')
const viteApiUrl = import.meta.env.VITE_API_URL
const xSessionId = globalThis.crypto?.randomUUID?.() ?? `chat-${Date.now()}`

function addMessage(text, type) {
  const bubble = document.createElement('div')
  bubble.className = `chat-bubble ${type} mb-3`
  bubble.textContent = text
  messages.appendChild(bubble)
  messages.scrollTop = messages.scrollHeight
}

function setLoadingState(isLoading) {
  if (!submitButton) return

  submitButton.disabled = isLoading
  submitButton.textContent = isLoading ? '전송 중...' : '전송'
}

form?.addEventListener('submit', async (event) => {
  event.preventDefault()

  const message = input.value.trim()
  if (!message || submitButton?.disabled) return

  addMessage(message, 'user')
  input.value = ''
  setLoadingState(true)

  try {
    const response = await fetch(`${viteApiUrl}/api/v1/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Session-ID': xSessionId
      },
      body: JSON.stringify({ message })
    })

    const result = await response.json().catch(() => null)

    if (!response.ok) {
      throw new Error(result?.message || 'AI 서버 응답을 받지 못했습니다.')
    }

    const content = result?.data?.content || '응답을 받지 못했습니다.'
    addMessage(content, 'ai')
  } catch (error) {
    addMessage(
      error instanceof Error ? error.message : 'AI 응답 처리 중 오류가 발생했습니다.',
      'ai'
    )
  } finally {
    setLoadingState(false)
    input.focus()
  }
})
