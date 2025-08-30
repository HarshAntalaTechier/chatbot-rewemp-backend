const {
  connectedUsers,
  pendingNotifications,
} = require("../../constants/socketStore");
const {
  handleCreateNotificationService,
} = require("../notification/notification.service");

// Handle new WebSocket connections
function handleConnection(ws, req) {
  const user_id = req.url.slice(1);

  // Init user connection array if not exists
  connectedUsers[user_id] = connectedUsers[user_id] || [];

  if (!connectedUsers[user_id].includes(ws)) {
    connectedUsers[user_id].push(ws);

    // Handle pending notifications
    if (pendingNotifications[user_id]) {
      pendingNotifications[user_id].forEach((message) =>
        ws.send(JSON.stringify({ msg: message, id: user_id }))
      );
      delete pendingNotifications[user_id];
    }
  }

  ws.on("close", () => handleDisconnect(ws, user_id));
  ws.on("error", (error) => console.error("WebSocket error:", error));
}

// Handle disconnect
function handleDisconnect(ws, user_id) {
  connectedUsers[user_id] = connectedUsers[user_id].filter(
    (existingWs) => existingWs !== ws
  );
  if (connectedUsers[user_id].length === 0) {
    delete connectedUsers[user_id];
  }
}

// Send message to specific user
function sendMessage(user_id, notificationData) {
  if (connectedUsers[user_id]) {
    connectedUsers[user_id].forEach((ws) => {
      if (ws.readyState === ws.OPEN) {
        ws.send(JSON.stringify({ ...notificationData, id: user_id }));
      }
    });
  } else {
    pendingNotifications[user_id] = pendingNotifications[user_id] || [];
    pendingNotifications[user_id].push(notificationData);
  }
}

function handleReconnect(user_id, ws) {
  connectedUsers[user_id] = connectedUsers[user_id] || [];
  if (!connectedUsers[user_id].includes(ws)) {
    connectedUsers[user_id].push(ws);
  }
}

const WebSocketChannelHandler = async (data, key) => {
  try {
    const notificationData = {
      key: key,
      data: {
        body: data.body,
      },
    };
    if (key === "NEW_CONVERSATION_USER") {
      await handleCreateNotificationService({
        body: data.body,
        user_id: data.user_id,
      });
      sendMessage(data.user_id, notificationData);
    }
  } catch (error) {
    console.log(
      "====================== ERROR FROM WebSocketChannelHandler CONTROLLER ======================"
    );
    console.log(error);
  }
};

module.exports = {
  handleConnection,
  sendMessage,
  handleReconnect,
  WebSocketChannelHandler,
};
