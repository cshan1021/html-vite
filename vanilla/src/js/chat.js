const form = document.querySelector('#chatForm')
const input = document.querySelector('#chatInput')
const messages = document.querySelector('#chatMessages')

function addMessage(text, type) {
  const bubble = document.createElement('div')
  bubble.className = `chat-bubble ${type} mb-3`
  bubble.textContent = text
  messages.appendChild(bubble)
  messages.scrollTop = messages.scrollHeight
}

form?.addEventListener('submit', (event) => {
  event.preventDefault()

  const message = input.value.trim()
  if (!message) return

  addMessage(message, 'user')
  input.value = ''

  // 실제 AI API 연결 전까지 화면 동작을 확인할 수 있는 임시 응답입니다.
  setTimeout(() => {
    addMessage(`요청하신 내용을 확인했습니다: ${message}`, 'ai')
  }, 400)
})
