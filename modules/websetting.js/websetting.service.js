const ResponseHelpers = require("../../Helper/ResponseHelper");
const { WebSettingModel } = require("../../models");
const handleCreateWebsettingService = async (data) => {
  try {
    const { chatbot_id, chatbot_integration_script } = data;
    const websetting = await WebSettingModel.create({
      chatbot_id,
      chatbot_integration_script,
    });
    if (websetting) {
      return ResponseHelpers.serviceToController(
        1,
        websetting.dataValues,
        "Web setting created successfully"
      );
    } else {
      return ResponseHelpers.serviceToController(
        0,
        [],
        "Failed to create web setting."
      );
    }
  } catch (err) {
    console.error(err);
    return ResponseHelpers.serviceToController(
      0,
      [],
      "Error while processing web setting."
    );
  }
};

const updateWebsettingService = async (data) => {
  try {
    const {
      websetting_id,
      chatbot_avatar_url,
      chatbot_size,
      chatbot_color,
      chatbot_heading_background_color,
      chatbot_card_background,
      chatbot_position,
      chatbot_name_text_color,
      chatbot_user_message_background_color,
      chatbot_user_message_text_color,
      chatbot_bot_message_background_color,
      chatbot_bot_message_text_color,
    } = data;
    const websetting = await WebSettingModel.update(
      {
        chatbot_avatar_url,
        chatbot_size,
        chatbot_color,
        chatbot_heading_background_color,
        chatbot_card_background,
        chatbot_position,
        chatbot_name_text_color,
        chatbot_user_message_background_color,
        chatbot_user_message_text_color,
        chatbot_bot_message_background_color,
        chatbot_bot_message_text_color,
      },
      { where: { websetting_id } }
    );
    if (websetting) {
      return ResponseHelpers.serviceToController(
        1,
        websetting.dataValues,
        "Web setting updated successfully"
      );
    } else {
      return ResponseHelpers.serviceToController(
        0,
        [],
        "Failed to update web setting."
      );
    }
  } catch (err) {
    console.error(err);
    return ResponseHelpers.serviceToController(
      0,
      [],
      "Error while processing web setting."
    );
  }
};

const getWebsettingDatabyChatbotIdService = async (data) => {
  try {
    const { chatbot_id } = data;
    const websetting = await WebSettingModel.findOne({
      where: { chatbot_id },
    });
    if (websetting) {
      return ResponseHelpers.serviceToController(
        1,
        websetting.dataValues,
        "Web setting retrieved successfully"
      );
    } else {
      return ResponseHelpers.serviceToController(
        0,
        [],
        "Failed to retrieve web setting."
      );
    }
  } catch (err) {
    console.error(err);
    return ResponseHelpers.serviceToController(
      0,
      [],
      "Error while processing web setting."
    );
  }
};

module.exports = {
  handleCreateWebsettingService,
  updateWebsettingService,
  getWebsettingDatabyChatbotIdService,
};
