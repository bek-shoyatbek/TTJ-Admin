const { Markup } = require('telegraf');

const db = require('../db');

const fs = require('fs');

const PDFDocument = require('pdfkit-table');

const doc = new PDFDocument({ margin: 30, size: 'A4' });


function restart(ctx) {
    ctx.reply("Assalamu alaykum TTJ bot ga Xush kelibsiz!", Markup.keyboard([
        ['➡️ Talabalarni TTJ ga kiritish'],
        ['🔔 Yordam', '👥 TTJ lar bo\'yicha ma\'lumot '],
    ]).resize(true))
}

function info(ctx) {
    ctx.reply("TTJ ni tanlang", Markup.keyboard([["🏛TTJ 1", "🏛TTJ 2"], ["🏛TTJ 3", "◀️ Asosiy Menu"]]).resize());
}

function mainMenu(ctx) {
    ctx.reply("Assalamu alaykum TTJ bot ga Xush kelibsiz!", Markup.keyboard([
        ['➡️ Talabalarni TTJ ga kiritish'],
        ['🔔 Yordam', '👥 TTJ lar bo\'yicha ma\'lumot '], ["🖨Talabalar ro'yhati"]
    ]).resize())
}

function insertStudent(ctx) {
    ctx.reply("Talabani TTJ ga qo'shish", {
        reply_markup: {
            inline_keyboard: [
                [{ text: " TTJ-1 ", callback_data: "ttj1" }, { text: "TTJ-2 ", callback_data: "ttj2" }, { text: "TTJ-3", callback_data: "ttj3" }],
            ]
        }
    }, Markup.keyboard([["◀️ Asosiy Menu"]]).resize());
}

function help(ctx) {
    ctx.reply("Biz yordamga hamisha tayyormiz", Markup.keyboard([["🙍🏻‍♂️Admin bilan bog'lanish"], ["◀️ Asosiy Menu"]]).resize())
}

function contactAdmin(ctx) {
    ctx.replyWithContact(`${process.env.owner_number}`, `${process.env.owner_username}`, Markup.keyboard([["🙍🏻‍♂️Admin bilan bog'lanish"], ["◀️ Asosiy Menu"]]).resize());
}

async function sendData(ctx) {
    let ttjNumber = ctx.match.input.split("").filter(e => e.match(/[0-9]/))[0];
    const students = await db.User.find({
        ttj: ttjNumber
    })
        .select("-__v -_id");
    if (students.length == 0) {
        return ctx.reply("Bu TTJ da Talabalar yo'q", Markup.keyboard([["◀️ Asosiy Menu"]]).resize())
    }
    let data = students.map(d => {
        return d =
            `🧑‍🎓Familiya Ism: ${d.fullName}` + "                                                                         " +

            ` 🗄Fukultet: ${d.fakultet}` + "                                                                                  " +

            ` 📚Kurs: ${d.kurs}` + "                                                                                                " +

            `  👥Guruh: ${d.guruh}` + "                                                                                                                                  " +

            `  🏛TTJ : ${d.ttj} ` + "                                                                                  "
    });
    for (let i of data) {
        let dataString = JSON.stringify(i, null, 2);
        ctx.reply(dataString, Markup.keyboard([["◀️ Asosiy Menu"]]).resize());
    }
}

async function printPDF(ctx) {
    doc.pipe(fs.createWriteStream('../students.pdf'));
    let students = await db.User.find()
        .select("-__v -_id");
    if (students.length == 0) {
        return ctx.reply("Bu TTJ da Talabalar yo'q", Markup.keyboard([["◀️ Asosiy Menu"]]).resize())
    }
    students = students.map(s => {
        return [s.fullName, s.fakultet, s.kurs, s.guruh, s.ttj];
    })
    const table = {
        title: { label: "Hamma talabalar ro'yhati", fontSize: 20, color: 'gray' },
        subtitle: { label: "TTJ", color: "silver" },
        headers: ["To'liq ismi", "Fakulteti", "Kurs", "Guruhi", "TTJ raqami"],
        rows: [
            ...students
        ],
    };
    await doc.table(table);
    doc.end();
    ctx.replyWithDocument({ source: "students.pdf" })
}

async function getUserInput(ctx) {
    const text = ctx.message.text.trim();
    switch (ctx.db.step) {
        case 1:
            ctx.db.student.fullName = text;
            ctx.db.step++;
            ctx.reply("Fakultet nomini kiriting");
            break;
        case 2:
            ctx.db.student.fakultet = text;
            ctx.db.step++;
            ctx.reply("Kursi va guruhini");
            break;
        case 3:
            let data = ctx.db.student;
            ctx.db.student.kurs = text.split(' ')[0];
            ctx.db.student.guruh = text.split(' ')[1];
            ctx.db.step = 0;
            if (!data.kurs || !data.guruh) {
                return ctx.reply(`Qaysidir ma'lumotlar yetarli emas❌`, Markup.keyboard([["◀️ Asosiy Menu"]]).resize())
            }
            const isOldStudent = await db.User.findOne({
                fullname: data.fullName,
                guruh: data.guruh,
                ttj: data.ttj
            });
            if (isOldStudent) {
                return ctx.reply("Bu student allaqachon TTJ da");
            }
            const student = await db.User.create({
                fullName: data.fullName,
                guruh: data.guruh,
                fakultet: data.fakultet,
                ttj: data.ttj,
                kurs: data.kurs
            });
            await student.save()
            ctx.reply("Talaba TTJ ga joylandi");
            break;
    }
}

module.exports = {
    restart, info, mainMenu, sendData,
    insertStudent, help, contactAdmin,
    printPDF, getUserInput
};