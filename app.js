const { Telegraf, Markup, Input } = require('telegraf');

const db = require('./db');

const { quit, start } = require('./src/commands');

const { logger } = require('./src/middlewares');

const { restart, info, mainMenu, insertStudent,
    help, contactAdmin, sendData,
    printPDF, getUserInput, writeDoc } = require('./src/listeners');

const { hadleChosenTTJ } = require('./src/actions');

// const { error_handler } = require('./src/error_handler');

require('dotenv').config();

const bot = new Telegraf(process.env.bot_token, { compress: true });

db.connectDB();

bot.context.db = {
    student: {},
    step: 0
}

bot.command('quit', quit);

bot.use(logger);

(writeDoc());

bot.start(start);



bot.hears("▶️Restart", restart);

bot.hears("👥 TTJ lar bo'yicha ma'lumot", info);

bot.hears("◀️ Asosiy Menu", mainMenu);

bot.hears("➡️ Talabalarni TTJ ga kiritish", insertStudent)

bot.action(/[ttj]/, hadleChosenTTJ);

bot.hears("🔔 Yordam", help);

bot.hears("🙍🏻‍♂️Admin bilan bog'lanish", contactAdmin);

bot.hears(/[🏛]/, sendData);

bot.hears(/[🖨]/, printPDF);

bot.on("message", getUserInput);

function error_handler(err, ctx) {
    console.log(`Ooops, encountered an error for ${ctx.updateType}`, err);
    ctx.reply("Serverda qandaydir texnik nosozlik bor", Markup.keyboard([["🙍🏻‍♂️Admin bilan bog'lanish"], ["◀️ Asosiy Menu"]]).resize());
    bot.telegram.sendVideo(ctx.chat.id, { source: './files/error.mp4' })
}

bot.catch(error_handler);


bot.launch({ compress: true });

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
