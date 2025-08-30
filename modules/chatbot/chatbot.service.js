const axios = require("axios");
const { XMLParser } = require("fast-xml-parser");
const ResponseHelpers = require("../../Helper/ResponseHelper");
const cheerio = require("cheerio");
const fs = require("fs");
const path = require("path");
const parser = new XMLParser();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const { FileUploaderFunction } = require("../../common/fileUpload");
const { ChatBotModel } = require("../../models");
const {
  handleCreateWebsettingService,
} = require("../websetting.js/websetting.service");
const { API_URL, WS_URL, GEMINI_API_KEY } = require("../../config");
const {
  storeConversationService,
} = require("../conversation/conversation.service");
const { log } = require("console");
// Init Gemini + File Manager
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

const fetchSitemap = async (sitemapUrl) => {
  log("Fetching sitemap:", sitemapUrl);
  try {
    const { data: xmlData } = await axios.get(sitemapUrl, { timeout: 10000 });
    const jsonObj = parser.parse(xmlData);

    let nestedUrls = [];

    if (jsonObj.sitemapindex && jsonObj.sitemapindex.sitemap) {
      const sitemaps = Array.isArray(jsonObj.sitemapindex.sitemap)
        ? jsonObj.sitemapindex.sitemap
        : [jsonObj.sitemapindex.sitemap];

      for (const sitemap of sitemaps) {
        const urls = await fetchSitemap(sitemap.loc);
        nestedUrls = nestedUrls.concat(urls);
      }
      return nestedUrls;
    }

    if (jsonObj.urlset && jsonObj.urlset.url) {
      const urls = Array.isArray(jsonObj.urlset.url)
        ? jsonObj.urlset.url.map((u) => u.loc)
        : [jsonObj.urlset.url.loc];
      return urls;
    }

    return [];
  } catch (err) {
    console.error(`❌ Error fetching sitemap: ${sitemapUrl}`, err.message);
    return [];
  }
};

const getSitemapsFromRobots = async (websiteUrl) => {
  try {
    const robotsUrl = websiteUrl.endsWith("/")
      ? `${websiteUrl}robots.txt`
      : `${websiteUrl}/robots.txt`;

    const { data } = await axios.get(robotsUrl, { timeout: 10000 });

    const sitemapUrls = data
      .split("\n")
      .filter((line) => line.toLowerCase().startsWith("sitemap:"))
      .map((line) => line.replace(/sitemap:/i, "").trim());

    return sitemapUrls;
  } catch (err) {
    console.error(
      `❌ Failed to fetch robots.txt from ${websiteUrl}`,
      err.message
    );
    return [];
  }
};

const getSitemapListfromwebsiteService = async (data) => {
  try {
    const sitemapUrls = await getSitemapsFromRobots(data.url);

    if (sitemapUrls.length === 0) {
      return ResponseHelpers.serviceToController(
        2,
        [],
        "We couldn’t find a sitemap in robots.txt, or something went wrong. Please check the website URL and try again."
      );
    }

    let allUrls = [];
    for (const sitemap of sitemapUrls) {
      const urls = await fetchSitemap(sitemap);
      allUrls = allUrls.concat(urls);
    }

    return ResponseHelpers.serviceToController(
      1,
      allUrls,
      "Sitemap fetched successfully"
    );
  } catch (err) {
    console.error(`❌ Error processing website: ${data.url}`, err.message);
    return ResponseHelpers.serviceToController(2, [], "Error fetching sitemap");
  }
};

async function crawlWebsiteServices(data) {
  try {
    const savedFiles = [];

    for (const url of data.urls) {
      const response = await axios.get(url);

      const $ = cheerio.load(response.data);

      $("script, style, iframe, img, noscript, svg, link, meta").remove();

      let text = $("body").text();

      text = text.replace(/\s+/g, " ").trim();

      let safeName = url.replace(/^https?:\/\//, "");
      safeName = safeName.replace(/[^a-zA-Z0-9]/g, "_");

      const fileName = `${safeName}.txt`;
      const filePath = path.join(
        __dirname,
        `../../files/crawled-files/${fileName}`
      );

      fs.writeFileSync(filePath, text, "utf8");

      savedFiles.push(fileName);
    }
    if (savedFiles.length === 0) {
      return ResponseHelpers.serviceToController(
        2,
        [],
        "No valid URLs provided or no content found."
      );
    }

    const createChatbot = await ChatBotModel.create({
      chatbot_name: data.chatbot_name,
      user_id: data.user_id,
      website_url: data.website_url,
      sitemap_list: JSON.stringify(data.urls),
      chatbot_created_using: 0,
      crawled_file: JSON.stringify(savedFiles),
    });
    if (!createChatbot) {
      return ResponseHelpers.serviceToController(
        2,
        [],
        "Failed to create chatbot"
      );
    }
    await handleCreateWebsettingService({
      chatbot_id: createChatbot?.dataValues?.chatbot_id,
      chatbot_integration_script: `<script>
 (function () {
   var s = document.createElement("script");
   s.src = "${API_URL}/chatbot-widgets/widget.js";
   s.async = true;
   document.head.appendChild(s);
   window.CW_BOOT = {
     apiBase: "${API_URL}",
     wsBase: "${WS_URL}",
     position: "right",
     chatbot_id: "${createChatbot?.dataValues?.chatbot_id}",
     user_id: "${data.user_id}"
   };
   };
 })();
</script>
`,
    });

    // await trainChatbotService({
    //   chatbot_id: createChatbot.dataValues.chatbot_id,
    // });
    return ResponseHelpers.serviceToController(
      1,
      createChatbot.dataValues,
      "Chatbot created and training initiated."
    );
  } catch (err) {
    console.error(err);
    return ResponseHelpers.serviceToController(
      0,
      [],
      "Error while processing URLs."
    );
  }
}

const trainChatbotService = async (data) => {
  try {
    const files = [];
    const { chatbot_id } = data;
    const fetchCrawledFile = await ChatBotModel.findOne({
      where: { chatbot_id },
    });
    if (!fetchCrawledFile) {
      return ResponseHelpers.serviceToController(
        2,
        [],
        "Failed to retrieve crawled file"
      );
    }
    const crawled_file = JSON.parse(fetchCrawledFile.crawled_file);

    for (const file of crawled_file) {
      const filePath = path.join(
        __dirname,
        `../../files/crawled-files/${file}`
      );
      if (fs.existsSync(filePath)) {
        files.push(filePath);
      }
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const summaries = [];

    for (const filePath of files) {
      const textData = fs.readFileSync(filePath, "utf8");

      const result = await model.generateContent({
        contents: [
          {
            role: "user",
            parts: [
              { text: textData },
              { text: "Summarize this text into 3 bullet points." },
            ],
          },
        ],
      });

      const responseText = result.response.text();
      summaries.push(`📄 ${path.basename(filePath)}:\n${responseText}`);
    }

    // Combine all summaries into one final response
    const finalResponse = summaries.join("\n\n---\n\n");

    const updateChatbot = await ChatBotModel.update(
      { is_chatbot_trained: true },
      { where: { chatbot_id } }
    );
    if (!updateChatbot) {
      return ResponseHelpers.serviceToController(
        2,
        [],
        "Failed to train chatbot"
      );
    }
    return ResponseHelpers.serviceToController(
      1,
      finalResponse,
      "The chatbot has been successfully built and trained, ready to deliver results."
    );
  } catch (err) {
    console.error("❌ Error:", err);
    return ResponseHelpers.serviceToController(
      0,
      [],
      "Something went wrong while training chatbot"
    );
  }
};

const trainChatbotUsingtextFileService = async (data) => {
  try {
    const { files, chatbot_name, user_id } = data;
    if (!files || files.length === 0) {
      return ResponseHelpers.serviceToController(
        2,
        [],
        "No files provided for upload"
      );
    }

    const uploadedFiles = FileUploaderFunction(data.files, "crawled-files");
    if (uploadedFiles.length === 0) {
      return ResponseHelpers.serviceToController(2, [], "File upload failed");
    }

    const createChatbot = ChatBotModel.create({
      chatbot_name: chatbot_name,
      user_id: user_id,
      uploaded_file_list: JSON.stringify(uploadedFiles),
      chatbot_created_using: "text_file",
      crawled_file: JSON.stringify(uploadedFiles),
    });

    if (!createChatbot) {
      return ResponseHelpers.serviceToController(
        2,
        [],
        "Failed to create chatbot"
      );
    }
    // await trainChatbotService({
    //   chatbot_id: createChatbot.dataValues.chatbot_id,
    // });
  } catch (error) {
    console.error("❌ Error:", error);
    return ResponseHelpers.serviceToController(
      0,
      [],
      "Something went wrong while training chatbot using text file"
    );
  }
};

const getChatbotByUserService = async (data) => {
  try {
    const { user_id } = data;
    console.log("====================================");
    console.log(user_id);
    console.log("====================================");
    const chatbots = await ChatBotModel.findAll({
      attributes: ["chatbot_id", "chatbot_name", "user_id"],
      where: { user_id: user_id },
      order: [["createdAt", "DESC"]],
    });

    if (chatbots.length === 0) {
      return ResponseHelpers.serviceToController(
        2,
        [],
        "No chatbots found for this user"
      );
    }

    return ResponseHelpers.serviceToController(
      1,
      chatbots,
      "Chatbots retrieved successfully"
    );
  } catch (error) {
    console.error("❌ Error:", error);
    return ResponseHelpers.serviceToController(
      0,
      [],
      "Something went wrong while fetching chatbots"
    );
  }
};

const getChatbotDetailsService = async (data) => {
  try {
    const { chatbot_id } = data;
    const chatbot = await ChatBotModel.findOne({ where: { chatbot_id } });
    if (!chatbot) {
      return ResponseHelpers.serviceToController(2, [], "Chatbot not found");
    }
    return ResponseHelpers.serviceToController(
      1,
      chatbot,
      "Chatbot retrieved successfully"
    );
  } catch (error) {
    console.error("❌ Error:", error);
    return ResponseHelpers.serviceToController(
      0,
      [],
      "Something went wrong while retrieving chatbot"
    );
  }
};

const trainChatbotWhenUserComeOnWebsiteService = async (data) => {
  try {
    const files = [];
    console.log(data);

    const { chatbot_id, conversation_user_id } = data;
    const fetchCrawledFile = await ChatBotModel.findOne({
      where: { chatbot_id },
    });
    if (!fetchCrawledFile) {
      return ResponseHelpers.serviceToController(
        2,
        [],
        "Failed to retrieve crawled file"
      );
    }
    const crawled_file = JSON.parse(fetchCrawledFile.crawled_file);

    for (const file of crawled_file) {
      const filePath = path.join(
        __dirname,
        `../../files/crawled-files/${file}`
      );
      if (fs.existsSync(filePath)) {
        files.push(filePath);
      }
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const summaries = [];

    for (const filePath of files) {
      const textData = fs.readFileSync(filePath, "utf8");

      const result = await model.generateContent({
        contents: [
          {
            role: "user",
            parts: [
              { text: textData },
              {
                text: "Carefully read and understand the text provided. Once understood, respond exclusively with the greeting: 'Hi, how may I help you?' Do not provide any additional information, commentary, or instructions—only the greeting.",
              },
            ],
          },
        ],
      });

      const responseText = result.response.text();
      summaries.push(`${responseText}`);
    }
    const finalResponse = summaries[0] || "Hello there, how may I help you?";
    storeConversationService({
      message_by: "bot",
      message: finalResponse,
      chatbot_id: chatbot_id,
      conversation_user_id: conversation_user_id || 0,
    });
    return ResponseHelpers.serviceToController(1, finalResponse, "");
  } catch (err) {
    console.error("❌ Error:", err);
    return ResponseHelpers.serviceToController(
      0,
      [],
      "Something went wrong while processing"
    );
  }
};

const trainChatbotWhenUserComeOnWebsiteServiceFromAdmin = async (data) => {
  try {
    const files = [];
    console.log(data);

    const { chatbot_id } = data;
    const fetchCrawledFile = await ChatBotModel.findOne({
      where: { chatbot_id },
    });
    if (!fetchCrawledFile) {
      return ResponseHelpers.serviceToController(
        2,
        [],
        "Failed to retrieve crawled file"
      );
    }
    const crawled_file = JSON.parse(fetchCrawledFile.crawled_file);

    for (const file of crawled_file) {
      const filePath = path.join(
        __dirname,
        `../../files/crawled-files/${file}`
      );
      if (fs.existsSync(filePath)) {
        files.push(filePath);
      }
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const summaries = [];

    for (const filePath of files) {
      const textData = fs.readFileSync(filePath, "utf8");

      const result = await model.generateContent({
        contents: [
          {
            role: "user",
            parts: [
              { text: textData },
              {
                text: "Carefully read and understand the text provided. Once understood, respond exclusively with the greeting: 'Hi, how may I help you?' Do not provide any additional information, commentary, or instructions—only the greeting.",
              },
            ],
          },
        ],
      });

      const responseText = result.response.text();
      summaries.push(`${responseText}`);
    }
    const finalResponse = summaries[0] || "Hello there, how may I help you?";
    return ResponseHelpers.serviceToController(1, finalResponse, "");
  } catch (err) {
    console.error("❌ Error:", err);
    return ResponseHelpers.serviceToController(
      0,
      [],
      "Something went wrong while processing"
    );
  }
};

module.exports = {
  getSitemapListfromwebsiteService,
  crawlWebsiteServices,
  trainChatbotService,
  trainChatbotUsingtextFileService,
  getChatbotByUserService,
  getChatbotDetailsService,
  trainChatbotWhenUserComeOnWebsiteService,
  trainChatbotWhenUserComeOnWebsiteServiceFromAdmin,
};
