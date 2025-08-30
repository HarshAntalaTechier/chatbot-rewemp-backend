const ResponseHelpers = require("../../Helper/ResponseHelper");
const { ConversationUserModel } = require("../../models");
const {
  WebSocketChannelHandler,
} = require("../websocket/websocket.controller");
const createConversationUserService = async (data) => {
  try {
    const { chatbot_id, full_name, user_email, user_phone, user_id } = data;
    const ConversationUser = await ConversationUserModel.create({
      chatbot_id,
      full_name,
      user_email,
      user_phone,
    });
    if (ConversationUser) {
      WebSocketChannelHandler(
        {
          body: "New visitor alert: Someone has entered your website chat.",
          user_id: user_id,
        },
        "NEW_CONVERSATION_USER"
      );
      return ResponseHelpers.serviceToController(
        1,
        ConversationUser.dataValues,
        "Conversation user created successfully"
      );
    }
  } catch (error) {
    console.error("Error creating conversation user service:", error);
    throw new Error("Failed to create conversation user service");
  }
};

module.exports = {
  createConversationUserService,
};
