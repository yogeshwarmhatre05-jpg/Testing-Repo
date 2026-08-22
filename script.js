(() => {
  'use strict';

  /* ============================================
     State
     ============================================ */
  const STORAGE_KEY = 'marginal.chats.v1';
  const SETTINGS_KEY = 'marginal.settings.v1';

  const defaultSettings = {
    mode: 'demo',
    endpoint: '',
    apiKey: '',
    model: 'gpt-4o-mini',
    userName: 'You'
  };

  let settings = { ...defaultSettings, ...loadJSON(SETTINGS_KEY, {}) };
  let chats = loadJSON(STORAGE_KEY, []); // [{id, title, messages:[{role,content}], createdAt}]
  let activeChatId = chats[0]?.id ?? null;
  let isGenerating = false;

  function loadJSON(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch {
      return fallback;
    }
  }
  function persistChats() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(chats));
  }
  function persistSettings() {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  }

  /* ============================================
     DOM refs
     ============================================ */
  const $ = (sel) => document.querySelector(sel);

  const app = $('#app');
  const sidebar = $('#sidebar');
  const sidebarToggle = $('#sidebarToggle');
  const chatList = $('#chatList');
  const newChatBtn = $('#newChatBtn');

  const thread = $('#thread');
  const emptyState = $('#emptyState');
  const messagesEl = $('#messages');
  const chips = $('#chips');

  const composerForm = $('#composerForm');
  const composerInput = $('#composerInput');
  const sendBtn = $('#sendBtn');

  const modelTag = $('#modelTag');
  const modelName = $('#modelName');
  const statusDot = $('#statusDot');

  const settingsBtn = $('#settingsBtn');
  const modalBackdrop = $('#modalBackdrop');
  const closeSettings = $('#closeSettings');
  const saveSettingsBtn = $('#saveSettingsBtn');
  const clearAllBtn = $('#clearAllBtn');
  const modeSelect = $('#modeSelect');
  const liveFields = $('#liveFields');
  const endpointInput = $('#endpointInput');
  const apiKeyInput = $('#apiKeyInput');
  const modelInput = $('#modelInput');
  const userNameInput = $('#userNameInput');

  /* ============================================
     Init
     ============================================ */
  function init() {
    renderChatList();
    renderThread();
    updateModelTag();
    bindEvents();
    autoGrow();
  }

  function bindEvents() {
    newChatBtn.addEventListener('click', createNewChat);
    sidebarToggle.addEventListener('click', toggleSidebar);

    composerForm.addEventListener('submit', onSubmit);
    composerInput.addEventListener('input', () => {
      autoGrow();
      sendBtn.disabled = !composerInput.value.trim() || isGenerating;
    });
    composerInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        composerForm.requestSubmit();
      }
    });

    chips.addEventListener('click', (e) => {
      const btn = e.target.closest('.chip');
      if (!btn) return;
      composerInput.value = btn.dataset.prompt;
      sendBtn.disabled = false;
      composerForm.requestSubmit();
    });

    settingsBtn.addEventListener('click', openSettings);
    closeSettings.addEventListener('click', closeSettingsModal);
    modalBackdrop.addEventListener('click', (e) => {
      if (e.target === modalBackdrop) closeSettingsModal();
    });
    modeSelect.addEventListener('change', () => {
      liveFields.classList.toggle('hidden', modeSelect.value !== 'live');
    });
    saveSettingsBtn.addEventListener('click', saveSettings);
    clearAllBtn.addEventListener('click', clearAllChats);
  }

  /* ============================================
     Sidebar
     ============================================ */
  function toggleSidebar() {
    const isMobile = window.innerWidth <= 780;
    if (isMobile) app.classList.toggle('sidebar-open');
    else app.classList.toggle('sidebar-collapsed');
  }

  function renderChatList() {
    chatList.innerHTML = '';
    if (chats.length === 0) {
      const hint = document.createElement('p');
      hint.className = 'empty-list-hint';
      hint.textContent = 'Your conversations will appear here.';
      chatList.appendChild(hint);
      return;
    }
    chats.forEach((chat) => {
      const item = document.createElement('div');
      item.className = 'chat-item' + (chat.id === activeChatId ? ' active' : '');
      item.setAttribute('role', 'button');
      item.tabIndex = 0;

      const title = document.createElement('span');
      title.className = 'title';
      title.textContent = chat.title || 'New chat';

      const del = document.createElement('span');
      del.className = 'del';
      del.innerHTML = '<svg width="13" height="13" viewBox="0 0 15 15" fill="none"><path d="M3 4H12M6 4V2.5H9V4M4.5 4V12.5H10.5V4" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/></svg>';
      del.addEventListener('click', (e) => {
        e.stopPropagation();
        deleteChat(chat.id);
      });

      item.appendChild(title);
      item.appendChild(del);
      item.addEventListener('click', () => switchChat(chat.id));

      chatList.appendChild(item);
    });
  }

  function createNewChat() {
    const chat = { id: crypto.randomUUID(), title: '', messages: [], createdAt: Date.now() };
    chats.unshift(chat);
    activeChatId = chat.id;
    persistChats();
    renderChatList();
    renderThread();
    if (window.innerWidth <= 780) app.classList.remove('sidebar-open');
    composerInput.focus();
  }

  function switchChat(id) {
    activeChatId = id;
    renderChatList();
    renderThread();
    if (window.innerWidth <= 780) app.classList.remove('sidebar-open');
  }

  function deleteChat(id) {
    chats = chats.filter((c) => c.id !== id);
    if (activeChatId === id) activeChatId = chats[0]?.id ?? null;
    persistChats();
    renderChatList();
    renderThread();
  }

  function clearAllChats() {
    if (!confirm('Delete all conversations? This cannot be undone.')) return;
    chats = [];
    activeChatId = null;
    persistChats();
    renderChatList();
    renderThread();
    closeSettingsModal();
  }

  function getActiveChat() {
    return chats.find((c) => c.id === activeChatId) || null;
  }

  /* ============================================
     Thread rendering
     ============================================ */
  function renderThread() {
    const chat = getActiveChat();
    messagesEl.innerHTML = '';

    if (!chat || chat.messages.length === 0) {
      emptyState.style.display = 'flex';
      messagesEl.style.display = 'none';
      return;
    }

    emptyState.style.display = 'none';
    messagesEl.style.display = 'flex';

    chat.messages.forEach((msg) => appendMessageEl(msg.role, msg.content));
    thread.scrollTop = thread.scrollHeight;
  }

  function appendMessageEl(role, content) {
    const wrap = document.createElement('div');
    wrap.className = `msg ${role}`;

    const avatar = document.createElement('div');
    avatar.className = 'msg-avatar';
    avatar.textContent = role === 'user' ? (settings.userName || 'You').slice(0, 1).toUpperCase() : 'M';

    const body = document.createElement('div');
    body.className = 'msg-body';

    const name = document.createElement('p');
    name.className = 'msg-name';
    name.textContent = role === 'user' ? (settings.userName || 'You') : 'Marginal';

    const text = document.createElement('div');
    text.className = 'msg-text';
    text.innerHTML = formatContent(content);

    body.appendChild(name);
    body.appendChild(text);
    wrap.appendChild(avatar);
    wrap.appendChild(body);
    messagesEl.appendChild(wrap);
    return text;
  }

  function formatContent(raw) {
    // Minimal, safe-ish markdown: escape html, then support ```code``` and `code`
    const escaped = raw
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    const withBlocks = escaped.replace(/```([\s\S]*?)```/g, (_, code) => {
      return `<pre><code>${code.trim()}</code></pre>`;
    });

    return withBlocks.replace(/`([^`]+)`/g, '<code>$1</code>');
  }

  /* ============================================
     Sending messages
     ============================================ */
  function autoGrow() {
    composerInput.style.height = 'auto';
    composerInput.style.height = Math.min(composerInput.scrollHeight, 200) + 'px';
  }

  function onSubmit(e) {
    e.preventDefault();
    const value = composerInput.value.trim();
    if (!value || isGenerating) return;

    let chat = getActiveChat();
    if (!chat) {
      chat = { id: crypto.randomUUID(), title: '', messages: [], createdAt: Date.now() };
      chats.unshift(chat);
      activeChatId = chat.id;
    }

    if (!chat.title) {
      chat.title = value.slice(0, 42) + (value.length > 42 ? '…' : '');
    }

    chat.messages.push({ role: 'user', content: value });
    persistChats();
    renderChatList();
    renderThread();

    composerInput.value = '';
    autoGrow();
    sendBtn.disabled = true;

    generateReply(chat);
  }

  async function generateReply(chat) {
    isGenerating = true;

    emptyState.style.display = 'none';
    messagesEl.style.display = 'flex';

    // Typing indicator
    const wrap = document.createElement('div');
    wrap.className = 'msg assistant';
    wrap.innerHTML = `
      <div class="msg-avatar">M</div>
      <div class="msg-body">
        <p class="msg-name">Marginal</p>
        <div class="msg-text"><span class="typing-dots"><span></span><span></span><span></span></span></div>
      </div>`;
    messagesEl.appendChild(wrap);
    thread.scrollTop = thread.scrollHeight;
    const textEl = wrap.querySelector('.msg-text');

    try {
      if (settings.mode === 'live' && settings.endpoint && settings.apiKey) {
        const reply = await callLiveApi(chat);
        await streamInto(textEl, reply);
        chat.messages.push({ role: 'assistant', content: reply });
      } else {
        const reply = mockReply(chat.messages[chat.messages.length - 1].content, chat.messages.length);
        await streamInto(textEl, reply);
        chat.messages.push({ role: 'assistant', content: reply });
      }
    } catch (err) {
      const msg = `Something went wrong reaching the API: ${err.message}. Check your endpoint and key in Settings, or switch back to Demo mode.`;
      textEl.innerHTML = formatContent(msg);
      chat.messages.push({ role: 'assistant', content: msg });
    }

    persistChats();
    isGenerating = false;
    sendBtn.disabled = !composerInput.value.trim();
  }

  async function streamInto(el, fullText) {
    el.innerHTML = '';
    const words = fullText.split(/(\s+)/);
    let acc = '';
    for (let i = 0; i < words.length; i++) {
      acc += words[i];
      el.innerHTML = formatContent(acc);
      thread.scrollTop = thread.scrollHeight;
      // eslint-disable-next-line no-await-in-loop
      await sleep(8 + Math.random() * 18);
    }
  }

  function sleep(ms) {
    return new Promise((res) => setTimeout(res, ms));
  }

  /* ============================================
     Demo reply engine (no network)
     ============================================ */
  function mockReply(userText, turnCount) {
    const t = userText.toLowerCase();

    if (/^(hi|hello|hey)\b/.test(t)) {
      return "Hey there. What are you working on — happy to dig into code, writing, or just think something through with you.";
    }
    if (t.includes('error') || t.includes('bug') || t.includes('debug')) {
      return "I can't run code in demo mode, but here's how I'd approach it:\n\n1. Reproduce it in isolation — cut the surrounding code away until you have the smallest failing example.\n2. Read the error from the bottom up; the root cause is usually the last frame that's actually yours.\n3. Check assumptions at the boundary — the input right before the failure is almost always where reality diverged from what the code expected.\n\nPaste the actual error and the relevant snippet and I'll be more specific. To get real answers instead of this canned one, switch to Live mode in Settings and point it at your own API key.";
    }
    if (t.includes('function') || t.includes('debounce') || t.includes('code')) {
      return "Here's a small debounce helper as a starting point:\n\n```js\nfunction debounce(fn, delay = 300) {\n  let timer;\n  return (...args) => {\n    clearTimeout(timer);\n    timer = setTimeout(() => fn(...args), delay);\n  };\n}\n```\n\nThis is a static demo response, not a live model — connect a real API key in Settings for actual generated code.";
    }
    if (t.includes('summar')) {
      return "Paste the text you'd like summarized and I'll pull out the core claims and structure. In demo mode I can't actually process your text, but Live mode (Settings → Mode → Live) will let a real model do this.";
    }
    if (t.includes('opinion') || t.includes('think')) {
      return "Lay out the approach and the constraint you're weighing it against, and I'll push back where it's worth pushing back and agree where it holds up. This is a demo reply though — for a real second opinion, connect an API key under Settings.";
    }

    const generic = [
      "That's a reasonable place to start. Tell me a bit more about the constraint you're working within, and I'll narrow this down with you.",
      "Noted. This is running in demo mode, so I'm working from canned responses rather than actually reasoning about what you wrote — flip to Live mode in Settings to connect a real model.",
      "Got it. In a live setup I'd respond to the specifics of that — for now, here's the demo placeholder. Check Settings to wire up a real API endpoint."
    ];
    return generic[turnCount % generic.length];
  }

  /* ============================================
     Live API mode (optional, user-supplied key)
     ============================================ */
  async function callLiveApi(chat) {
    const payload = {
      model: settings.model || 'gpt-4o-mini',
      messages: chat.messages.map((m) => ({ role: m.role, content: m.content })),
      stream: false
    };

    const res = await fetch(settings.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${settings.apiKey}`
      },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      const body = await res.text().catch(() => '');
      throw new Error(`HTTP ${res.status} ${body.slice(0, 200)}`);
    }

    const data = await res.json();
    // Supports OpenAI-style chat completions shape.
    const content =
      data?.choices?.[0]?.message?.content ??
      data?.content?.[0]?.text ??
      JSON.stringify(data).slice(0, 400);

    return content;
  }

  /* ============================================
     Settings modal
     ============================================ */
  function openSettings() {
    modeSelect.value = settings.mode;
    endpointInput.value = settings.endpoint;
    apiKeyInput.value = settings.apiKey;
    modelInput.value = settings.model;
    userNameInput.value = settings.userName;
    liveFields.classList.toggle('hidden', settings.mode !== 'live');
    modalBackdrop.classList.add('open');
  }

  function closeSettingsModal() {
    modalBackdrop.classList.remove('open');
  }

  function saveSettings() {
    settings = {
      mode: modeSelect.value,
      endpoint: endpointInput.value.trim(),
      apiKey: apiKeyInput.value.trim(),
      model: modelInput.value.trim() || 'gpt-4o-mini',
      userName: userNameInput.value.trim() || 'You'
    };
    persistSettings();
    updateModelTag();
    renderThread();
    closeSettingsModal();
  }

  function updateModelTag() {
    const live = settings.mode === 'live' && settings.endpoint && settings.apiKey;
    modelName.textContent = live ? settings.model : 'demo-model';
    statusDot.classList.toggle('live', !!live);
  }

  init();
})();