// https://github.com/yagop/node-telegram-bot-api/issues/319#issuecomment-324963294
// Fixes an error with Promise cancellation
process.env.NTBA_FIX_319 = "test";

const TelegramBot = require("node-telegram-bot-api");
const vampireTrow = require("../functions/vampire");

module.exports = async (request, response) => {
  try {
    const bot = new TelegramBot(process.env.TELEGRAM_TKN);

    // Retrieve the POST request body that gets sent from Telegram
    const { body } = request;
    console.log(process.env.TELEGRAM_TKN);
    // Ensure that this is a message being sent
    if (body.message) {
      // Retrieve the ID for this chat
      // and the text that the user sent
      const {
        chat: { id },
        text,
      } = body.message;

      if (text && text.substring(0, 1) === "/") {
        if (text && text.substring(1, 2).toLowerCase() === "v") {
          //the comnad is for vampire dice throw
          const message = vampireTrow(text.toLowerCase().split("v")[1]);
          // Send our new message back in Markdown and
          // wait for the request to finish
          await bot.sendMessage(id, message, { parse_mode: "Markdown" });
        }
      }
    }
  } catch (error) {
    // If there was an error sending our message then we
    // can log it into the Vercel console
    console.error("Error sending message");
    console.log(error.toString());
  }
  // Acknowledge the message with Telegram
  // by sending a 200 HTTP status code
  // The message here doesn't matter.
  response.send("OK");
};
