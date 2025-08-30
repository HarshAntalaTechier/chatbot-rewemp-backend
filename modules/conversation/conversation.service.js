const { Op } = require("sequelize");
const ResponseHelpers = require("../../Helper/ResponseHelper");
const { ConversationUserModel, ConversationModel } = require("../../models");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const { GEMINI_API_KEY } = require("../../config");
// Init Gemini + File Manager
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

const storeConversationService = async (data) => {
  try {
    const createConversation = await ConversationModel.create({
      conversation_date: new Date(),
      message_by: data.message_by,
      chatbot_id: data.chatbot_id,
      conversation_user_id: data.conversation_user_id,
      message: data.message,
    });
    if (createConversation) {
      return ResponseHelpers.serviceToController(
        1,
        createConversation.dataValues,
        ""
      );
    } else {
      return ResponseHelpers.serviceToController(
        0,
        [],
        "Something went wrong while processing"
      );
    }
  } catch (err) {
    console.error("❌ Error:", err);
    return ResponseHelpers.serviceToController(
      0,
      [],
      "Something went wrong while processing"
    );
  }
};

const getChatHistoryService = async (data) => {
  try {
    // Calculate 24 hours ago
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const chatHistory = await ConversationUserModel.findAll({
      where: {
        conversation_user_id: data.conversation_user_id,
        conversation_date: {
          [Op.gte]: twentyFourHoursAgo, // only messages from last 24 hours
        },
      },
      order: [["conversation_date", "ASC"]],
    });

    if (chatHistory && chatHistory.length > 0) {
      return ResponseHelpers.serviceToController(1, chatHistory, "");
    } else {
      return ResponseHelpers.serviceToController(
        0,
        [],
        "No chat history found in last 24 hours"
      );
    }
  } catch (err) {
    console.error("❌ Error:", err);
    return ResponseHelpers.serviceToController(
      0,
      [],
      "Something went wrong while fetching chat history"
    );
  }
};

const getResponsefromGeminiService = async (data) => {
  const { chatbot_id, conversation_user_id, messageText } = data;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [
            {
              text: messageText,
            },
          ],
        },
      ],
    });
    const responseText = result.response.text();
    storeConversationService({
      message_by: "bot",
      message: responseText,
      chatbot_id: chatbot_id,
      conversation_user_id: conversation_user_id || 0,
    });
    return ResponseHelpers.serviceToController(1, responseText, "");
  } catch (err) {
    console.error("❌ Error:", err);
    return ResponseHelpers.serviceToController(
      0,
      [],
      "Something went wrong while fetching response from Gemini"
    );
  }
};

const getResponsefromGeminiforTestingService = async (data) => {
  const { message } = data;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [
            {
              text: message,
            },
          ],
        },
      ],
    });
    const responseText = result.response.text();
    return ResponseHelpers.serviceToController(1, responseText, "");
  } catch (err) {
    console.error("❌ Error:", err);
    return ResponseHelpers.serviceToController(
      0,
      [],
      "Something went wrong while fetching response from Gemini"
    );
  }
};

module.exports = {
  storeConversationService,
  getChatHistoryService,
  getResponsefromGeminiService,
  getResponsefromGeminiforTestingService,
};
