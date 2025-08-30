const express = require("express");
const cors = require("cors");
const sequelize = require("./database");
const WebSocketServer = require("ws");
const bodyParser = require("body-parser");
const {
  PORT,
  NODE_ENV,
  FULL_NAME,
  USER_EMAIL,
  COMPANY_NAME,
  COMPANY_EMAIL,
  PASSWORD,
} = require("./config");
const app = express();
const env = NODE_ENV;
const fileupload = require("express-fileupload");
const { createSuperAdminUserService } = require("./modules/Auth/auth.service");
const {
  handleConnection,
} = require("./modules/websocket/websocket.controller");

sequelize.sync();

app.use(cors());
app.use(express.text());
app.use(fileupload());
app.use(express.static("files"));

app.use(bodyParser.json({ limit: "1024mb" }));
app.use(
  bodyParser.urlencoded({
    limit: "2048mb",
    extended: true,
    parameterLimit: 102400000,
  })
);

const routes = [
  require("./modules/Auth/auth.routes"),
  require("./modules/chatbot/chatbot.routes"),
  require("./modules/conversation-user/conversation-user.routes"),
  require("./modules/conversation/conversation.routes"),
  require("./modules/package/package.routes"),
  require("./modules/package-purchase-details/package-purchse-details.routes"),
  require("./modules/websetting.js/websetting.routes"),
];

app.use(express.static("public"));
routes.forEach((route) => app.use(route));

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal Server Error" });
});

const server = app.listen(PORT, function () {
  createSuperAdminUserService({
    full_name: FULL_NAME,
    user_email: USER_EMAIL,
    company_name: COMPANY_NAME,
    company_email: COMPANY_EMAIL,
    password: PASSWORD,
  });
  console.log("=================================");
  console.log(`========== ENV: ${env} ===========`);
  console.log(`🚀 App listening on the port ${PORT}`);
  console.log("=================================");
});

const wss = new WebSocketServer.Server({ server });

wss.on("connection", (ws, req) => handleConnection(ws, req));
