const ResponseHelpers = require("../../Helper/ResponseHelper");
const NotificationModel = require("../../models/notification.model");
const handleCreateNotificationService = async (data) => {
  try {
    const { user_id, body } = data;
    const notification = await NotificationModel.create({
      user_id,
      body,
      status: 0,
      notification_date_time: new Date(),
    });
    if (notification) {
      return ResponseHelpers.serviceToController(
        1,
        notification.dataValues,
        "Notification created successfully"
      );
    } else {
      return ResponseHelpers.serviceToController(
        0,
        [],
        "Failed to create notification."
      );
    }
  } catch (err) {
    console.error(err);
    return ResponseHelpers.serviceToController(
      0,
      [],
      "Error while processing notification."
    );
  }
};

module.exports = {
  handleCreateNotificationService,
};
