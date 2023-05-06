const { Markup } = require('telegraf');


function hadleChosenTTJ(ctx) {
    ctx.db.step = 0;
    ctx.db.student.ttj = ctx.match.input.split("").filter(e => e.match(/[0-9]/))[0];
    ctx.db.step++;
    ctx.reply("Talabaning familiyasi va ismini kiriting", Markup.keyboard([["◀️ Asosiy Menu"]]).resize());
}

module.exports = { hadleChosenTTJ };