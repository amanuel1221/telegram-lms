const bot = require('../config/telegram');

const notifyNewPdf = async (pdf) => {
  if (!bot) return;

  const channelId = process.env.TELEGRAM_CHANNEL_ID;
  const miniAppUrl = process.env.TELEGRAM_MINI_APP_URL;

  if (!channelId || !miniAppUrl) {
    console.warn('Telegram Channel ID or Mini App URL missing in environment.');
    return;
  }

  const message =
    `📚 *New PDF Available*\n\n` +
    `*Title:* ${pdf.title}\n` +
    `*Subject:* ${pdf.subject}\n` +
    `*Semester:* ${pdf.semester}\n` +
    `${pdf.description ? `*Description:* ${pdf.description}\n` : ''}\n` +
    `Open in Telegram Mini App 👇`;

  const options = {
    parse_mode: 'Markdown',
    reply_markup: {
      inline_keyboard: [[{ text: 'Open LMS', url: miniAppUrl }]],
    },
  };

  try {
    await bot.sendMessage(channelId, message, options);
  } catch (error) {
    console.error('Failed to send Telegram channel message:', error);
  }
};

module.exports = { notifyNewPdf };