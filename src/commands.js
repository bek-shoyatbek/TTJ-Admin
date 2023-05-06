const { Markup } = require('telegraf');


function quit(ctx) {
    if (ctx.chat.type == "private") {
        ctx.reply("Foydalanganingiz uchun rahmat😊", Markup.keyboard([
            ['▶️Restart'],
        ]).resize(true))
    }
}

function start(ctx) {
    ctx.reply("Assalamu alaykum TTJ bot ga Xush kelibsiz!", Markup.keyboard([
        ['➡️ Talabalarni TTJ ga kiritish'],
        ['🔔 Yordam', '👥 TTJ lar bo\'yicha ma\'lumot '],
    ]).resize(true))
}


module.exports = {
    quit,
    start
}