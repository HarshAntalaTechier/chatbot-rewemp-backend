/* eslint-env browser */

(function () {
  // ==========================
  // --- CONFIGURATION ---
  // ==========================
  const currentScript = document.currentScript;
  const getAttribute = (attr, defaultValue = "") =>
    (currentScript && currentScript.getAttribute(attr)) || defaultValue;

  const CHATBOT_ID =
    getAttribute("data-bot-id") || window.CW_BOOT?.chatbot_id || "";
  const CREATOR_ID =
    getAttribute("data-creator-id") || window.CW_BOOT?.user_id || "";
  const API_BASE_URL =
    getAttribute("data-api-base") || window.CW_BOOT?.apiBase || "";
  const WS_BASE_URL =
    getAttribute("data-ws-base") || window.CW_BOOT?.wsBase || "";
  const WIDGET_POSITION =
    getAttribute("data-position") || window.CW_BOOT?.position || "right";

  if (!CHATBOT_ID || !CREATOR_ID || !API_BASE_URL || !WS_BASE_URL) {
    console.error(
      "[ChatWidget] Missing required configuration: bot-id/creator-id/api-base/ws-base"
    );
    return;
  }

  // ==========================
  // --- UTILITIES ---
  // ==========================
  const createElement = (tag, attributes = {}, styles = {}) => {
    const element = document.createElement(tag);
    Object.entries(attributes).forEach(([key, value]) => {
      if (key === "text") element.textContent = value;
      else if (key === "html") element.innerHTML = value;
      else element.setAttribute(key, value);
    });
    Object.assign(element.style || {}, styles);
    return element;
  };

  const storageKey = (key) => `cw_${CHATBOT_ID}_${key}`;
  const saveToLocal = (key, value) =>
    localStorage.setItem(storageKey(key), JSON.stringify(value));
  const loadFromLocal = (key) => {
    try {
      return JSON.parse(localStorage.getItem(storageKey(key)) || "");
    } catch {
      return null;
    }
  };

  const fetchJSON = async (url, options = {}) => {
    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return response.json();
  };

  // ==========================
  // --- STATE ---
  // ==========================
  const STATE = {
    conversationUserId: loadFromLocal("conversation_user_id") || "",
    websocket: null,
    elements: {},
  };

  // ==========================
  // --- INJECT CSS ---
  // ==========================
  (function injectStyles() {
    const cssURL =
      getAttribute("data-css") ||
      currentScript?.src?.replace(/widget\.js(?:\?.*)?$/, "widget.css") ||
      "";
    if (cssURL) {
      const link = createElement("link", { rel: "stylesheet", href: cssURL });
      document.head.appendChild(link);
    }

    const style = createElement("style", {
      html: `
      .cw-error { border: 1px solid red !important; }
      .cw-error-text { color: red; font-size: 12px; margin: 2px 0 6px; }
    `,
    });
    document.head.appendChild(style);
  })();

  // ==========================
  // --- BUILD UI ---
  // ==========================
  function buildChatUI() {
    const chatButton = createElement("div", {
      class: "cw-btn",
      role: "button",
      "aria-label": "Open chat",
      text: "💬",
    });

    document.body.appendChild(chatButton);

    const chatWrapper = createElement("div", { class: "cw-wrap" });
    if (WIDGET_POSITION === "left") {
      chatWrapper.style.left = "20px";
      chatButton.style.left = "20px";
      chatButton.style.right = "";
    }
    document.body.appendChild(chatWrapper);

    // Header
    const chatHeader = createElement(
      "div",
      { class: "cw-head" },
      {
        background: "#f5f5f5",
        borderBottom: "1px solid #eee",
        padding: "12px 16px",
      }
    );
    const chatTitle = createElement("div", { text: "Chat" });
    const closeBtn = createElement(
      "button",
      { text: "✕", "aria-label": "Close" },
      {
        background: "transparent",
        border: "none",
        color: "#fff",
        cursor: "pointer",
        fontSize: "16px",
      }
    );
    chatHeader.append(chatTitle, closeBtn);

    // Form
    const chatForm = createElement("div", { class: "cw-form" });
    const nameInput = createElement("input", {
      class: "cw-input",
      placeholder: "Your name",
      id: "cw-name",
    });
    const nameError = createElement("div", {
      class: "cw-error-text",
      id: "cw-name-err",
    });
    const emailInput = createElement("input", {
      class: "cw-input",
      placeholder: "Your email",
      type: "email",
      id: "cw-email",
    });
    const emailError = createElement("div", {
      class: "cw-error-text",
      id: "cw-email-err",
    });
    const phoneInput = createElement("input", {
      class: "cw-input",
      placeholder: "Your phone",
      type: "tel",
      id: "cw-phone",
    });
    const phoneError = createElement("div", {
      class: "cw-error-text",
      id: "cw-phone-err",
    });
    const startChatBtn = createElement("button", {
      class: "cw-btn-primary",
      id: "cw-start",
      text: "Start chat",
    });

    chatForm.append(
      nameInput,
      nameError,
      emailInput,
      emailError,
      phoneInput,
      phoneError,
      startChatBtn
    );

    // Chat area
    const chatArea = createElement(
      "div",
      { class: "cw-chat" },
      { display: "none" }
    );
    const messagesContainer = createElement("div", {
      class: "cw-msgs",
      id: "cw-msgs",
    });
    const messageRow = createElement("div", { class: "cw-row" });
    const messageInput = createElement("input", {
      class: "cw-input",
      placeholder: "Type a message...",
      id: "cw-input",
    });
    const sendMessageBtn = createElement(
      "button",
      { class: "cw-btn-primary", id: "cw-send", text: "Send" },
      { width: "96px" }
    );
    messageRow.append(messageInput, sendMessageBtn);
    chatArea.append(messagesContainer, messageRow);

    chatWrapper.append(chatHeader, chatForm, chatArea);

    // Save references
    STATE.elements = {
      chatButton,
      chatWrapper,
      chatHeader,
      chatTitle,
      closeBtn,
      chatForm,
      nameInput,
      nameError,
      emailInput,
      emailError,
      phoneInput,
      phoneError,
      startChatBtn,
      chatArea,
      messagesContainer,
      messageInput,
      sendMessageBtn,
    };

    // Event listeners
    chatButton.addEventListener("click", toggleChat);
    closeBtn.addEventListener(
      "click",
      () => (chatWrapper.style.display = "none")
    );
    startChatBtn.addEventListener("click", startConversation);
    sendMessageBtn.addEventListener("click", sendMessage);
    messageInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") sendMessage();
    });
  }

  // ==========================
  // --- CHAT LOGIC ---
  // ==========================
  function toggleChat() {
    const { chatWrapper } = STATE.elements;
    const isOpen = chatWrapper.style.display === "flex";
    chatWrapper.style.display = isOpen ? "none" : "flex";
    chatWrapper.style.flexDirection = "column";
    if (!isOpen) loadChatEntry();
  }

  async function loadChatEntry() {
    const { chatForm, chatArea, messagesContainer } = STATE.elements;

    if (!STATE.conversationUserId) {
      // show form if no conversation_user_id
      chatForm.style.display = "block";
      chatArea.style.display = "none";
      return;
    }

    // if conversation_user_id exists, load chat directly
    try {
      const history = await fetchJSON(`${API_BASE_URL}/get-chat-history`, {
        method: "POST",
        body: JSON.stringify({
          conversation_user_id: STATE.conversationUserId,
        }),
      });
      chatForm.style.display = "none";
      chatArea.style.display = "block";
      history.forEach((msg) => addMessage(msg.message_by, msg.message));
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
      connectWebSocket();
    } catch {
      chatForm.style.display = "block";
      chatArea.style.display = "none";
    }
  }

  function clearFormErrors() {
    ["name", "email", "phone"].forEach((field) => {
      STATE.elements[`${field}Input`].classList.remove("cw-error");
      STATE.elements[`${field}Error`].textContent = "";
    });
  }

  function validateForm({ name, email, phone }) {
    clearFormErrors();
    let isValid = true;

    if (!name || name.length < 2) {
      STATE.elements.nameInput.classList.add("cw-error");
      STATE.elements.nameError.textContent = "Name is required (min 2 chars)";
      isValid = false;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailPattern.test(email)) {
      STATE.elements.emailInput.classList.add("cw-error");
      STATE.elements.emailError.textContent = "Enter a valid email";
      isValid = false;
    }

    const phonePattern = /^\+?[0-9]{8,15}$/;
    if (!phone || !phonePattern.test(phone)) {
      STATE.elements.phoneInput.classList.add("cw-error");
      STATE.elements.phoneError.textContent =
        "Enter a valid phone (8–15 digits)";
      isValid = false;
    }

    return isValid;
  }

  async function startConversation() {
    const name = STATE.elements.nameInput.value.trim();
    const email = STATE.elements.emailInput.value.trim();
    const phone = STATE.elements.phoneInput.value.trim();

    if (!validateForm({ name, email, phone })) return;

    try {
      const response = await fetchJSON(
        `${API_BASE_URL}/create-conversation-user`,
        {
          method: "POST",
          body: JSON.stringify({
            chatbot_id: CHATBOT_ID,
            user_id: CREATOR_ID,
            full_name: name,
            user_email: email,
            user_phone_no: phone,
          }),
        }
      );

      STATE.conversationUserId = response.conversation_user_id;
      saveToLocal("conversation_user_id", STATE.conversationUserId);
      connectWebSocket();
      initializeChatOnPageLoad({
        conversation_user_id: STATE.conversationUserId,
      });

      STATE.elements.chatForm.style.display = "none";
      STATE.elements.chatArea.style.display = "block";

      await loadChatEntry();
    } catch (err) {
      console.error("Could not start conversation:", err);
    }
  }

  function connectWebSocket() {
    try {
      STATE.websocket?.close();
    } catch (err) {
      console.error(err);
    }
    const wsURL = `${WS_BASE_URL}/${STATE.conversationUserId}`;

    const ws = new WebSocket(wsURL);
    STATE.websocket = ws;

    ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        if (message?.type === "message")
          addMessage(message.sender || "bot", message.text || "");
      } catch {
        addMessage("bot", String(event.data));
      }
    };

    ws.onclose = () => {
      setTimeout(() => {
        if (
          STATE.elements.chatWrapper.style.display === "flex" &&
          STATE.conversationUserId
        )
          connectWebSocket();
      }, 2000);
    };
  }

  async function sendMessage() {
    const messageText = STATE.elements.messageInput.value.trim();
    if (!messageText) return;

    // 1️⃣ Show user message instantly
    addMessage("user", messageText);
    STATE.elements.messageInput.value = "";

    // 2️⃣ Send via WebSocket for real-time updates (optional if needed)
    if (STATE.websocket && STATE.websocket.readyState === 1) {
      try {
        STATE.websocket.send(
          JSON.stringify({
            type: "message",
            conversation_user_id: STATE.conversationUserId,
            text: messageText,
          })
        );
      } catch (err) {
        console.error("WebSocket send error:", err);
      }
    }

    // 3️⃣ Save user message in DB and get bot response
    try {
      const response = await fetchJSON(`${API_BASE_URL}/store-conversation`, {
        method: "POST",
        body: JSON.stringify({
          conversation_user_id: STATE.conversationUserId,
          message: messageText,
          message_by: "user",
          chatbot_id: CHATBOT_ID,
        }),
      });

      // 4️⃣ Add bot response to chat instantly
      if (response) {
        await fetchJSON(`${API_BASE_URL}/get-response-from-gemini`, {
          method: "POST",
          body: JSON.stringify({
            conversation_user_id: STATE.conversationUserId,
            messageText: messageText,
            chatbot_id: CHATBOT_ID,
          }),
        });
        addMessage("bot", response.data);
      }
    } catch (err) {
      console.error("DB save / bot response error:", err);
    }
  }

  function addMessage(sender, text) {
    const bubble = createElement("div", {
      class: sender === "user" ? "cw-user" : "cw-bot",
      text,
    });
    STATE.elements.messagesContainer.appendChild(bubble);
    STATE.elements.messagesContainer.scrollTop =
      STATE.elements.messagesContainer.scrollHeight;
  }

  // ==========================
  // --- INITIALIZE ---
  // ==========================

  async function initializeChatOnPageLoad({ conversation_user_id }) {
    try {
      const initialMessage = await fetchJSON(
        `${API_BASE_URL}/train-chatbot-when-user-come-on-website`,
        {
          method: "POST",
          body: JSON.stringify({
            chatbot_id: CHATBOT_ID,
            conversation_user_id,
          }),
        }
      );
      if (initialMessage.status === 1) addMessage("bot", initialMessage.data);
      else
        console.error("Could not initialize chat:", initialMessage.description);
    } catch (err) {
      console.error("Could not initialize chat:", err);
    }
  }
  buildChatUI();
})();
