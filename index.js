const token = "7384403490:AAE9Rwqe6b1qOlAYZJgNdxhsGMTOECUyw98";

const TelegramBot = require("node-telegram-bot-api");
const webAppUrl = "https://tgwebapp29.netlify.app";
const express = require('express');
const cors = require('cors');


const bot = new TelegramBot(token, { polling: true });
const app = express();

app.use(express.json());
app.use(cors());

bot.on("message", async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  if (text === "/start") {
    await bot.sendMessage(
      chatId,
      "Заходи в наш интернет магазин по кнопке ниже",
      {
        reply_markup: {
          inline_keyboard: [
            [{ text: "Сделать заказ", web_app: { url: webAppUrl } }],
          ],
        },
      }
    );
    await bot.sendMessage(chatId, "Ниже появится кнопка, заполни форму", {
      reply_markup: {
        keyboard: [
          [{ text: "Заполнить форму", web_app: { url: webAppUrl + "/form" } }],
        ],
      },
    });
  }
  if (msg?.web_app_data?.data) {
    try {
      const data = JSON.parse(msg?.web_app_data?.data);
      await bot.sendMessage(chatId, "Спасибо за обратную связь!");
      await bot.sendMessage(
        chatId,
        "Данные: " + data.country + " " + data.street
      );
    } catch (e) {
      console.log(e);
    }
  }
});

app.post("/web-data", async (req, res) => {
  const {queryId, products, totalPrice} = res.body;
  try {
    await bot.answerWebAppQuery(queryId, {
      type: 'article',
      id: queryId,
      title: 'Успешная покупка',
      input_message_content: {massage_text: 'Поздравляем с покупкой, вы приобрели това на сумму ' + totalPrice},
    });
    return res.status(200).send({});
  }catch(e)  {
    await bot.answerWebAppQuery(queryId, {
      type: 'article',
      id: queryId,
      title: 'Не удалось приобрести товар',
      input_message_content: {massage_text: 'Не удалось приобрести товар'},
    });
    return res.status(500).end();
  }
})

const PORT = 8000;

app.listen(PORT, () => {console.log('server started on PORT ' + PORT + '!')});