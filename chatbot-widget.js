(function() {
  // Inject CSS
  const style = document.createElement('style');
  style.textContent = `
    #spikey-chat-toggle {
      position: fixed; bottom: 28px; right: 28px; z-index: 9999;
      width: 60px; height: 60px; border-radius: 50%;
      background: linear-gradient(135deg, #00f2fe, #00c6ff);
      border: none; cursor: pointer;
      box-shadow: 0 4px 24px rgba(0, 242, 254, 0.4);
      display: flex; align-items: center; justify-content: center;
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }
    #spikey-chat-toggle:hover {
      transform: scale(1.1);
      box-shadow: 0 6px 32px rgba(0, 242, 254, 0.6);
    }
    #spikey-chat-toggle svg { width: 28px; height: 28px; fill: #000; }

    #spikey-chat-panel {
      position: fixed; bottom: 100px; right: 28px; z-index: 9998;
      width: 380px; max-height: 520px;
      background: #0a0a0a;
      border: 1px solid rgba(0, 242, 254, 0.2);
      border-radius: 16px;
      display: none; flex-direction: column;
      overflow: hidden;
      box-shadow: 0 12px 48px rgba(0, 0, 0, 0.8), 0 0 40px rgba(0, 242, 254, 0.08);
      font-family: 'Inter', -apple-system, sans-serif;
      animation: spikeySlideUp 0.3s ease;
    }
    #spikey-chat-panel.open { display: flex; }

    @keyframes spikeySlideUp {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }

    #spikey-chat-header {
      padding: 16px 20px;
      background: linear-gradient(135deg, rgba(0, 242, 254, 0.1), rgba(0, 198, 255, 0.05));
      border-bottom: 1px solid rgba(0, 242, 254, 0.15);
      display: flex; align-items: center; gap: 12px;
    }
    #spikey-chat-header .spikey-avatar {
      width: 36px; height: 36px; border-radius: 50%;
      background: linear-gradient(135deg, #00f2fe, #00c6ff);
      display: flex; align-items: center; justify-content: center;
      font-size: 18px; color: #000; font-weight: 700;
    }
    #spikey-chat-header .spikey-info h4 {
      color: #fff; font-size: 14px; font-weight: 600; margin: 0;
    }
    #spikey-chat-header .spikey-info span {
      color: #00f2fe; font-size: 11px; display: flex; align-items: center; gap: 4px;
    }
    #spikey-chat-header .spikey-info span::before {
      content: ''; width: 6px; height: 6px; border-radius: 50%;
      background: #00f2fe; display: inline-block;
      animation: spikeyPulse 2s infinite;
    }
    @keyframes spikeyPulse {
      0%, 100% { opacity: 1; } 50% { opacity: 0.4; }
    }

    #spikey-chat-messages {
      flex: 1; overflow-y: auto; padding: 16px 16px 8px;
      min-height: 300px; max-height: 340px;
      scrollbar-width: thin;
      scrollbar-color: rgba(0, 242, 254, 0.3) transparent;
    }
    #spikey-chat-messages::-webkit-scrollbar { width: 4px; }
    #spikey-chat-messages::-webkit-scrollbar-thumb {
      background: rgba(0, 242, 254, 0.3); border-radius: 4px;
    }

    .spikey-msg {
      margin-bottom: 12px; max-width: 85%;
      padding: 10px 14px; border-radius: 12px;
      font-size: 13.5px; line-height: 1.5; color: #fff;
      animation: spikeyFadeIn 0.3s ease;
    }
    @keyframes spikeyFadeIn {
      from { opacity: 0; transform: translateY(8px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .spikey-msg.bot {
      background: rgba(255, 255, 255, 0.06);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 4px 12px 12px 12px;
    }
    .spikey-msg.user {
      background: linear-gradient(135deg, rgba(0, 242, 254, 0.15), rgba(0, 198, 255, 0.1));
      border: 1px solid rgba(0, 242, 254, 0.2);
      margin-left: auto;
      border-radius: 12px 4px 12px 12px;
    }
    .spikey-msg.typing { color: #888; font-style: italic; }

    #spikey-chat-input-area {
      padding: 12px 16px;
      border-top: 1px solid rgba(255, 255, 255, 0.08);
      display: flex; gap: 8px;
      background: rgba(0, 0, 0, 0.4);
    }
    #spikey-chat-input {
      flex: 1; padding: 10px 14px;
      background: rgba(255, 255, 255, 0.06);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 8px; color: #fff;
      font-size: 13px; font-family: inherit;
      outline: none; transition: border-color 0.2s;
    }
    #spikey-chat-input:focus {
      border-color: rgba(0, 242, 254, 0.4);
    }
    #spikey-chat-input::placeholder { color: #555; }
    #spikey-chat-send {
      padding: 10px 16px; border: none; border-radius: 8px;
      background: linear-gradient(135deg, #00f2fe, #00c6ff);
      color: #000; font-weight: 600; font-size: 13px;
      cursor: pointer; transition: opacity 0.2s;
    }
    #spikey-chat-send:hover { opacity: 0.85; }
    #spikey-chat-send:disabled { opacity: 0.4; cursor: not-allowed; }

    @media (max-width: 480px) {
      #spikey-chat-panel {
        width: calc(100vw - 24px); right: 12px; bottom: 90px;
        max-height: 70vh;
      }
      #spikey-chat-toggle { bottom: 16px; right: 16px; }
    }
  `;
  document.head.appendChild(style);

  // Inject HTML
  const widgetHTML = `
    <button id="spikey-chat-toggle" aria-label="Open chat">
      <svg viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H5.2L4 17.2V4h16v12z"/></svg>
    </button>
    <div id="spikey-chat-panel">
      <div id="spikey-chat-header">
        <div class="spikey-avatar">S</div>
        <div class="spikey-info">
          <h4>Spikey — TailorMade AI</h4>
          <span>Online</span>
        </div>
      </div>
      <div id="spikey-chat-messages"></div>
      <div id="spikey-chat-input-area">
        <input id="spikey-chat-input" type="text" placeholder="Ask about our AI solutions..." autocomplete="off" />
        <button id="spikey-chat-send">Send</button>
      </div>
    </div>
  `;

  const container = document.createElement('div');
  container.innerHTML = widgetHTML;
  document.body.appendChild(container);

  // Logic
  const toggle = document.getElementById('spikey-chat-toggle');
  const panel = document.getElementById('spikey-chat-panel');
  const messagesEl = document.getElementById('spikey-chat-messages');
  const input = document.getElementById('spikey-chat-input');
  const sendBtn = document.getElementById('spikey-chat-send');

  let chatHistory = [];
  let isOpen = false;

  function addMessage(text, sender) {
    const div = document.createElement('div');
    div.className = `spikey-msg ${sender}`;
    div.textContent = text;
    messagesEl.appendChild(div);
    messagesEl.scrollTop = messagesEl.scrollHeight;
    return div;
  }

  // Welcome message
  setTimeout(() => {
    addMessage("Hey! 👋 I'm Spikey, your AI assistant. Ask me anything about TailorMade AI's services, pricing, or how our AI can help your business!", 'bot');
  }, 500);

  toggle.addEventListener('click', () => {
    isOpen = !isOpen;
    panel.classList.toggle('open', isOpen);
    if (isOpen) input.focus();
  });

  async function sendMessage() {
    const text = input.value.trim();
    if (!text) return;

    addMessage(text, 'user');
    input.value = '';
    sendBtn.disabled = true;

    chatHistory.push({ role: 'user', content: text });

    const typingEl = addMessage('Spikey is thinking...', 'bot typing');

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: chatHistory }),
      });

      const data = await response.json();
      typingEl.remove();

      if (data.reply) {
        addMessage(data.reply, 'bot');
        chatHistory.push({ role: 'assistant', content: data.reply });
      } else {
        addMessage('Sorry, something went wrong. Please try again or book a call with us directly!', 'bot');
      }
    } catch (err) {
      typingEl.remove();
      addMessage('Connection error. Please try again or reach us at tailormadeagencycreations@gmail.com', 'bot');
    }

    sendBtn.disabled = false;
    input.focus();
  }

  sendBtn.addEventListener('click', sendMessage);
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') sendMessage();
  });
})();
