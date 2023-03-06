
"use strict";
const { BufferJSON, WA_DEFAULT_EPHEMERAL, proto, prepareWAMessageMedia, areJidsSameUser, getContentType } = require('@adiwajshing/baileys')
const { downloadContentFromMessage, generateWAMessage, generateWAMessageFromContent, MessageType, buttonsMessage } = require("@adiwajshing/baileys")
const { exec, spawn } = require("child_process");
const { color, bgcolor, pickRandom, randomNomor } = require('./lib/console.js')
const { isUrl, getRandom, getGroupAdmins, runtime, sleep, reSize, makeid, fetchJson, getBuffer } = require("./lib/myfunc");
const { addResponList, delResponList, isAlreadyResponList, isAlreadyResponListGroup, sendResponList, updateResponList, getDataResponList } = require('./lib/addlist');

// apinya
const fs = require("fs");
const ms = require("ms");
const chalk = require('chalk');
const axios = require("axios");
const colors = require('colors/safe');
const ffmpeg = require("fluent-ffmpeg");
const moment = require("moment-timezone");

// Database
const setting = JSON.parse(fs.readFileSync('./setting.json'));
const antilink = JSON.parse(fs.readFileSync('./database/antilink.json'));
const mess = JSON.parse(fs.readFileSync('./mess.json'));
const db_error = JSON.parse(fs.readFileSync('./database/error.json'));
const db_respon_list = JSON.parse(fs.readFileSync('./database/list.json'));

moment.tz.setDefault("Asia/Jakarta").locale("id");
module.exports = async(dryan, msg, m, setting, store) => {
try {
let { ownerNumber, botName } = setting
const { type, quotedMsg, mentioned, now, fromMe, isBaileys } = msg
if (msg.isBaileys) return
const jam = moment.tz('asia/jakarta').format('HH:mm:ss')
const tanggal = moment().tz("Asia/Jakarta").format("ll")
let dt = moment(Date.now()).tz('Asia/Jakarta').locale('id').format('a')
const ucapanWaktu = "Selamat "+dt.charAt(0).toUpperCase() + dt.slice(1)
const content = JSON.stringify(msg.message)
const from = msg.key.remoteJid
const time = moment(new Date()).format("HH:mm");
var chats = (type === 'conversation' && msg.message.conversation) ? msg.message.conversation : (type === 'imageMessage') && msg.message.imageMessage.caption ? msg.message.imageMessage.caption : (type === 'videoMessage') && msg.message.videoMessage.caption ? msg.message.videoMessage.caption : (type === 'extendedTextMessage') && msg.message.extendedTextMessage.text ? msg.message.extendedTextMessage.text : (type === 'buttonsResponseMessage') && quotedMsg.fromMe && msg.message.buttonsResponseMessage.selectedButtonId ? msg.message.buttonsResponseMessage.selectedButtonId : (type === 'templateButtonReplyMessage') && quotedMsg.fromMe && msg.message.templateButtonReplyMessage.selectedId ? msg.message.templateButtonReplyMessage.selectedId : (type === 'messageContextInfo') ? (msg.message.buttonsResponseMessage?.selectedButtonId || msg.message.listResponseMessage?.singleSelectReply.selectedRowId) : (type == 'listResponseMessage') && quotedMsg.fromMe && msg.message.listResponseMessage.singleSelectReply.selectedRowId ? msg.message.listResponseMessage.singleSelectReply.selectedRowId : ""
if (chats == undefined) { chats = '' }
const prefix = /^[°•π÷×¶∆£¢€¥®™✓_=|~!?#$%^&.+-,\/\\©^]/.test(chats) ? chats.match(/^[°•π÷×¶∆£¢€¥®™✓_=|~!?#$%^&.+-,\/\\©^]/gi) : '#'
const isGroup = msg.key.remoteJid.endsWith('@g.us')
const sender = isGroup ? (msg.key.participant ? msg.key.participant : msg.participant) : msg.key.remoteJid
const isOwner = [`${setting.ownerNumber}`,"6281327393959@s.whatsapp.net","6289513081052@s.whatsapp.net"].includes(sender) ? true : false
const pushname = msg.pushName
const body = chats.startsWith(prefix) ? chats : ''
const budy = (type === 'conversation') ? msg.message.conversation : (type === 'extendedTextMessage') ? msg.message.extendedTextMessage.text : ''
const args = body.trim().split(/ +/).slice(1);
const q = args.join(" ");
const isCommand = body.startsWith(prefix);
const command = body.slice(1).trim().split(/ +/).shift().toLowerCase()
const isCmd = isCommand ? body.slice(1).trim().split(/ +/).shift().toLowerCase() : null;
const botNumber = dryan.user.id.split(':')[0] + '@s.whatsapp.net'

// Group
const groupMetadata = isGroup ? await dryan.groupMetadata(from) : ''
const groupName = isGroup ? groupMetadata.subject : ''
const groupId = isGroup ? groupMetadata.id : ''
const participants = isGroup ? await groupMetadata.participants : ''
const groupMembers = isGroup ? groupMetadata.participants : ''
const groupAdmins = isGroup ? getGroupAdmins(groupMembers) : ''
const isBotGroupAdmins = groupAdmins.includes(botNumber) || false
const isGroupAdmins = groupAdmins.includes(sender)
const isAntiLink = antilink.includes(from) ? true : false

// Quoted
const quoted = msg.quoted ? msg.quoted : msg
const isImage = (type == 'imageMessage')
const isQuotedMsg = (type == 'extendedTextMessage')
const isMedia = (type === 'imageMessage' || type === 'videoMessage');
const isQuotedImage = isQuotedMsg ? content.includes('imageMessage') ? true : false : false
const isVideo = (type == 'videoMessage')
const isQuotedVideo = isQuotedMsg ? content.includes('videoMessage') ? true : false : false
const isSticker = (type == 'stickerMessage')
const isQuotedSticker = isQuotedMsg ? content.includes('stickerMessage') ? true : false : false 
const isQuotedAudio = isQuotedMsg ? content.includes('audioMessage') ? true : false : false
var dataGroup = (type === 'buttonsResponseMessage') ? msg.message.buttonsResponseMessage.selectedButtonId : ''
var dataPrivate = (type === "messageContextInfo") ? (msg.message.buttonsResponseMessage?.selectedButtonId || msg.message.listResponseMessage?.singleSelectReply.selectedRowId) : ''
const isButton = dataGroup.length !== 0 ? dataGroup : dataPrivate
var dataListG = (type === "listResponseMessage") ? msg.message.listResponseMessage.singleSelectReply.selectedRowId : ''
var dataList = (type === 'messageContextInfo') ? (msg.message.buttonsResponseMessage?.selectedButtonId || msg.message.listResponseMessage?.singleSelectReply.selectedRowId) : ''
const isListMessage = dataListG.length !== 0 ? dataListG : dataList

function mentions(teks, mems = [], id) {
if (id == null || id == undefined || id == false) {
let res = dryan.sendMessage(from, { text: teks, mentions: mems })
return res
} else {
let res = dryan.sendMessage(from, { text: teks, mentions: mems }, { quoted: msg })
return res
}
}

const mentionByTag = type == "extendedTextMessage" && msg.message.extendedTextMessage.contextInfo != null ? msg.message.extendedTextMessage.contextInfo.mentionedJid : []
const mentionByReply = type == "extendedTextMessage" && msg.message.extendedTextMessage.contextInfo != null ? msg.message.extendedTextMessage.contextInfo.participant || "" : ""
const mention = typeof(mentionByTag) == 'string' ? [mentionByTag] : mentionByTag
mention != undefined ? mention.push(mentionByReply) : []
const mentionUser = mention != undefined ? mention.filter(n => n) : []



const reply = (teks) => {dryan.sendMessage(from, { text: teks }, { quoted: msg })}

//Antilink
if (isGroup && isAntiLink && isBotGroupAdmins){
if (chats.includes(`https://chat.whatsapp.com/`) || budy.includes(`http://chat.whatsapp.com/`)) {
if (!isBotGroupAdmins) return reply('Untung bot bukan admin')
if (isOwner) return reply('Untung lu owner ku:v😙')
if (isGroupAdmins) return reply('Admin grup mah bebas ygy🤭')
if (fromMe) return reply('bot bebas Share link')
await conn.sendMessage(from, { delete: msg.key })
reply(`*「 GROUP LINK DETECTOR 」*\n\nTerdeteksi mengirim link group,Maaf sepertinya kamu akan di kick`)
conn.groupParticipantsUpdate(from, [sender], "remove")
}
}

// Response Addlist
if (!isCmd && isGroup && isAlreadyResponList(from, chats, db_respon_list)) {
var get_data_respon = getDataResponList(from, chats, db_respon_list)
if (get_data_respon.isImage === false) {
dryan.sendMessage(from, { text: sendResponList(from, chats, db_respon_list) }, {
quoted: msg
})
} else {
dryan.sendMessage(from, { image: await getBuffer(get_data_respon.image_url), caption: get_data_respon.response }, {
quoted: msg
})
}
}

const sendContact = (jid, numbers, name, quoted, mn) => {
let number = numbers.replace(/[^0-9]/g, '')
const vcard = 'BEGIN:VCARD\n' 
+ 'VERSION:3.0\n' 
+ 'FN:' + name + '\n'
+ 'ORG:;\n'
+ 'TEL;type=CELL;type=VOICE;waid=' + number + ':+' + number + '\n'
+ 'END:VCARD'
return dryan.sendMessage(from, { contacts: { displayName: name, contacts: [{ vcard }] }, mentions : mn ? mn : []},{ quoted: quoted })
}


const fkontak = { key: {fromMe: false,participant: `0@s.whatsapp.net`, ...(from ? { remoteJid: "status@broadcast" } : {}) }, message: { 'contactMessage': { 'displayName': `Bot Created By Dryan-MD\n`, 'vcard': `BEGIN:VCARD\nVERSION:3.0\nN:XL;DryanBOT,;;;\nFN:${pushname},\nitem1.TEL;waid=${sender.split('@')[0]}:${sender.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD`, 'jpegThumbnail': { url: 'https://telegra.ph/file/3c485ff201d9337be14ef.jpg' }}}}
function parseMention(text = '') {
return [...text.matchAll(/@([0-9]{5,16}|0)/g)].map(v => v[1] + '@s.whatsapp.net')
}


// Console
if (isGroup && isCmd) {
console.log(colors.green.bold("[Group]") + " " + colors.brightCyan(time,) + " " + colors.black.bgYellow(command) + " " + colors.green("from") + " " + colors.blue(groupName));
}

if (!isGroup && isCmd) {
console.log(colors.green.bold("[Private]") + " " + colors.brightCyan(time,) + " " + colors.black.bgYellow(command) + " " + colors.green("from") + " " + colors.blue(pushname));
}

// Casenya
switch(command) {
	case 'help':
	case 'menu':{
		const mark_slebew = '0@s.whatsapp.net'
const more = String.fromCharCode(8206)
const strip_ny = more.repeat(4001)
var footer_nya =`Creator by - ${setting.ownerName}`
	let menu = `━━━━━[ 𝘼𝙍𝙄 𝙑𝙋𝙉 𝙎𝙏𝙊𝙍𝙀 ]━━━━━


┏━━━『 𝘿𝘼𝙏𝘼 𝘽𝙊𝙏 』━━━━━◧
┃
┣» ᴄʀᴇᴀᴛᴏʀ : @${setting.kontakOwner}
┣» ʙᴏᴛ ɴᴀᴍᴇ : ${setting.botName}
┣» ᴏᴡɴᴇʀ ɴᴀᴍᴇ : ${setting.ownerName} 
┣» ʀᴜɴɴɪɴɢ : ᴘᴀɴᴇʟ 
┃
┗━━━━━━━━━━━━━━━━━━◧
┏━━━━『 𝙇𝙞𝙨𝙩 𝙈𝙚𝙣𝙪 』━━━━◧
┃
┣» .mainmenu
┣» .owmermenu
┣» .grupmenu
┃
┣» .listproduk
┣» .kalkulator
┣» .script
┣» .owner
┣» .donasi
┗━━━━━━━━━━━━━━━━━━◧`
let btn_menu = [
{buttonId: '#listproduk', buttonText: {displayText: '️𝗟𝗜𝗦𝗧 𝗣𝗥𝗢𝗗𝗨𝗞'}, type: 1},
{buttonId: '#mainmenu', buttonText: {displayText: '️𝗠𝗔𝗜𝗡 𝗠𝗘𝗡𝗨'}, type: 1},
{buttonId: '#sc', buttonText: {displayText: '️𝗦𝗖𝗥𝗜𝗣𝗧'}, type: 1},

]
dryan.sendMessage(from, {text: menu, buttons: btn_menu, footer: footer_nya, mentions: [setting.ownerNumber, sender]}, {quoted: fkontak})
dryan.sendMessage(from, {audio: {url: `./gambar/suara.mp3`}, mimetype:'audio/mpeg', ptt:true})
}
break
case 'mainmenu':{
	let menu = `
┏━━━━『 𝙈𝙖𝙞𝙣 𝙈𝙚𝙣𝙪 』━━━━◧
┃
┣» .produk
┣» .listproduk
┣» .donasi
┣» .ping
┣» .test
┣» .pembayaran 
┣» .bayar
┣» .script
┃
┗━━━━━━━━━━━━━━━━━━◧`
dryan.sendMessage(from, {text: menu}, {quoted: fkontak})
}
break
case 'grupmenu':{
	let menu = `
┏━━━━『 𝙂𝙧𝙤𝙪𝙥 𝙈𝙚𝙣𝙪 』━━━━◧
┃
┣» .hidetag
┣» .group open
┣» .group close 
┣» .antilink on
┣» .antilink off
┣» .kick 
┃
┣» .addlist
┣» .dellist
┣» .list
┣» .shop
┣» .hapuslist
┗━━━━━━━━━━━━━━━━━━◧`
dryan.sendMessage(from, {text: menu}, {quoted: fkontak})
}
break
case 'ownermenu':{
	let menu = `
┏━━━━『 𝙊𝙬𝙣𝙚𝙧 𝙈𝙚𝙣𝙪 』━━━━◧
┃
┣» .join
┣» .sendbyr 62xxx
┣» .block 62xxx 
┣» .unblock 62xxx
┃
┗━━━━━━━━━━━━━━━━━━◧`
dryan.sendMessage(from, {text: menu}, {quoted: fkontak})
}
break
case 'kalkulator':{
	let menu = `
┏━━━━『 𝙊𝙬𝙣𝙚𝙧 𝙈𝙚𝙣𝙪 』━━━━◧
┃
┣» .tambah
┣» .kali
┣» .bagi
┣» .kurang
┃
┗━━━━━━━━━━━━━━━━━━◧`
dryan.sendMessage(from, {text: menu}, {quoted: fkontak})
}
break
case 'listproduk':
case 'produk':{
const mark_slebew = '0@s.whatsapp.net'
const more = String.fromCharCode(8206)
const strip_ny = more.repeat(4001)
var footer_nya =`Creator by - ${setting.ownerName}`
let tampilan_nya = `𝙷𝚊𝚕𝚕𝚘 𝙺𝚊𝚔𝚊𝚔..👋
𝚂𝚊𝚢𝚊 𝙰𝚍𝚊𝚕𝚊𝚑 𝚂𝚒𝚜𝚝𝚎𝚖 𝚁𝚊𝚗𝚌𝚊𝚗𝚐𝚊𝚗 Saya adalah sistem Rancangan
𝙳𝚊𝚛𝚒 𝙳𝚛𝚢𝚊𝚗-𝙼𝙳.

𝙱𝙴𝚁𝙸𝙺𝚄𝚃 𝙻𝙸𝚂𝚃 𝙿𝚁𝙾𝙳𝚄𝙺 𝙺𝙰𝙼𝙸 𝚈𝙰𝙷 🙏,
𝙹𝙰𝙽𝙶𝙰𝙽 𝙻𝚄𝙿𝙰 𝚄𝙽𝚃𝚄𝙺 𝙾𝚁𝙳𝙴𝚁 👍
`
dryan.sendMessage(from,
{text: tampilan_nya,
buttonText: "𝙻𝙸𝚂𝚃 𝙿𝚁𝙾𝙳𝚄𝙺",
sections: [{title: "━━━━━━━━━━━━[ 𝗧𝗢𝗣 𝗨𝗣 ]━━━━━━━━━━━━",
rows: [
{title: "➠ 𝚂𝚂𝙷 𝚂𝙶 𝚅𝙸𝙿", rowId: prefix+"sg", description: "𝙼𝙴𝙽𝙰𝙼𝙿𝙸𝙻𝙺𝙰𝙽 𝙻𝙸𝚂𝚃 𝙷𝙰𝚁𝙶𝙰 𝙰𝙺𝚄𝙽 𝚂𝚂𝙷 𝚂𝙶 𝚅𝙸𝙿"},
{title: "➠ 𝚂𝚂𝙷 𝚂𝙶 𝚅𝚅𝙸𝙿", rowId: prefix+"sg1", description: "𝙼𝙴𝙽𝙰𝙼𝙿𝙸𝙻𝙺𝙰𝙽 𝙻𝙸𝚂𝚃 𝙷𝙰𝚁𝙶𝙰 𝙰𝙺𝚄𝙽 𝚂𝚂𝙷 𝚂𝙶 𝚅𝚅𝙸𝙿"},
{title: "➠ 𝚂𝚂𝙷 𝙸𝙳 𝙱𝙴𝚁𝙺𝙰𝙷", rowId: prefix+"id", description: "𝙼𝙴𝙽𝙰𝙼𝙿𝙸𝙻𝙺𝙰𝙽 𝙻𝙸𝚂𝚃 𝙷𝙰𝚁𝙶𝙰 𝙰𝙺𝚄𝙽 𝚂𝚂𝙷 𝙸𝙳 𝙱𝙴𝚁𝙺𝙰𝙷"},
{title: "➠ 𝚂𝚂𝙷 𝙸𝙳 𝙽𝚄𝚂𝙰", rowId: prefix+"id1", description: "𝙼𝙴𝙽𝙰𝙼𝙿𝙸𝙻𝙺𝙰𝙽 𝙻𝙸𝚂𝚃 𝙷𝙰𝚁𝙶𝙰 𝙰𝙺𝚄𝙽 𝚂𝚂𝙷 𝙸𝙳 𝙽𝚄𝚂𝙰"}]},
{title: "━━━━━━━━━━━━[ 𝗠𝗘𝗡𝗝𝗨𝗔𝗟 ]━━━━━━━━━━━━",
rows: [
{title: "➠ 𝙳𝙾𝙽𝙰𝚂𝙸 ", rowId: prefix+"donasi", description: "𝙳𝙾𝙽𝙰𝚂𝙸 𝙺𝙴𝙿𝙰𝙳𝙰 𝙱𝙾𝚃"},
{title: "➠ 𝚈𝙾𝚄𝚃𝚄𝙱𝙴 ", rowId: prefix+"yt", description: "𝚈𝙾𝚄𝚃𝚄𝙱𝙴 𝙰𝙳𝙼𝙸𝙽"},
{title: "➠ 𝙶𝚁𝙾𝚄𝙿 𝙶𝙲 ", rowId: prefix+"gc", description: "𝙶𝚁𝙾𝚄𝙿 𝙰𝙳𝙼𝙸𝙽"},
{title: "➠ 𝚂𝙲𝚁𝙸𝙿𝚃", rowId: prefix+"scbot", description: "𝚂𝙲𝚁𝙸𝙿𝚃 𝙷𝙰𝙽𝚈𝙰 𝙿𝚁𝙸𝙱𝙰𝙳𝙸"}]},
],
footer: footer_nya,
mentions:[setting.ownerNumber, sender]})
}
break
case 'owner':{
var owner_Nya = setting.ownerNumber
sendContact(from, owner_Nya, setting.ownerName, msg)
reply('*Itu kak nomor owner ku, Chat aja gk usah malu😆*')
}
break
case 'yt':
case 'youtube':
	dryan.sendMessage(from, 
{text: `Jangan Lupa Subscriber yah kak😉🙏
*Link* : https://youtube.com/@arivpnstore123`},
{quoted: msg})
break
case 'ig':
case 'instagram':
	dryan.sendMessage(from, {text: `Admin Kurang ngurus ig uyy Jadi subscribe aja YouTube admin\n\nLink https://youtube.com/@arivpnstore123`},
{quoted: msg})
break
case 'gc':
case 'groupadmin':
	dryan.sendMessage(from, 
{text: `*BAGI BAGI CONFIG*\n
GRUP : https://chat.whatsapp.com/C3MmpDbhnxs551jQLnMg2Y `},
{quoted: msg})
break
case 'donasi': case 'donate':{
let tekssss = ` ───「  *DONASI*  」────

💵PEMBAYARAN VIA ALL PAYMET :
💳DANA : 081327393959
💳LINK AJA : 081327393959
💳OVO : 081327393959 
💳GOPAY VIA QRIS
💳SHOPEEPAY VIA QRIS
💳BRI MOBILE QRIS
💳PULSA NOMER TRANSAKSI : 081327393959
berapapun donasi dari kalian itu sangat berarti bagi kami `

dryan.sendMessage(from, { image: fs.readFileSync(`./gambar/qris.jpg`),
 caption: tekssss, 
footer: `${setting.ownerName} © 2023`},
{quoted: msg})
}
break
case 'sendbyr':{
	if (!isOwner) return reply(mess.OnlyOwner)
	if (!q) return reply('*Contoh:*\n.add 628xxx')
	var number = q.replace(/[^0-9]/gi, '')+'@s.whatsapp.net'
let tekssss = `───「  *TRANFER VIA QRIS*  」────

💵PEMBAYARAN VIA ALL PAYMET :
💳DANA : 081327393959
💳LINK AJA : 081327393959
💳OVO : 081327393959 
💳GOPAY VIA QRIS
💳SHOPEEPAY VIA QRIS
💳BRI MOBILE QRIS
💳PULSA NOMER TRANSAKSI : 081327393959

_Pembayaran ini Telah di kirim oleh Admin 𝙰𝚁𝙸 𝚅𝙿𝙽 𝚂𝚃𝙾𝚁𝙴_
_Melalui bot ini🙏_

OK, thanks udah order di 𝙰𝚁𝙸 𝚅𝙿𝙽 𝚂𝚃𝙾𝚁𝙴
`
dryan.sendMessage(number, { image: fs.readFileSync(`./gambar/qris.jpg`),
 caption: tekssss, 
footer: `${setting.ownerName} © 2023`},
{quoted: msg})
reply (`Suksess Owner ku tercinta 😘🙏`)
}
break
case 'join':{
 if (!isOwner) return reply(mess.OnlyOwner)
if (!q) return reply(`Kirim perintah ${prefix+command} _linkgrup_`)
var ini_urrrl = q.split('https://chat.whatsapp.com/')[1]
var data = await dryan.groupAcceptInvite(ini_urrrl)
reply('*Sukses Join The Group..*')
}
break
case 'payment':
case 'pembayaran':
case 'bayar':{
let tekssss = `───「  *TRANFER VIA QRIS*  」────
💵PEMBAYARAN VIA ALL PAYMET :
💳DANA : 081327393959
💳LINK AJA : 081327393959
💳OVO : 081327393959 
💳GOPAY VIA QRIS
💳SHOPEEPAY VIA QRIS
💳BRI MOBILE QRIS
💳PULSA NOMER TRANSAKSI : 081327393959

OK, thanks udah order di 𝙰𝚁𝙸 𝚅𝙿𝙽 𝚂𝚃𝙾𝚁𝙴
`
dryan.sendMessage(from, { image: fs.readFileSync(`./gambar/qris.jpg`),
 caption: tekssss, 
footer: `${setting.ownerName} © 2023`},
{quoted: msg})
}
break
case 'sg':
case 'sshsg1':{
let teq =`*🔰👑𝗥𝗔𝗝𝗔 𝗦𝗘𝗩𝗘𝗥 𝗣𝗥𝗘𝗠𝗜𝗨𝗠👑🔰*
=================================
*🥇𝙱𝚈 𝙰𝚁𝙸 𝚅𝙿𝙽 𝚂𝚃𝙾𝚁𝙴🥇*
=================================
PILIH MODE INJECT NYA          
1. SSH/OPEN SSH/ SelowDns Account
2. Xray/Vmess Account
3. Xray/Vless Account
4. Trojan Account
5. Sodosok WS/GRPC Account       
=================================                                      
*SERVER SINGAPURA BUKA✓*
📝LIST HARGA & SERVER :
ISP : DIGITAL OCEAN 
1. sgpremium.my.id
DISCOUNT 30%
🇸🇬SG VIP  :  Rp 1.750   (3 HARI)
🇸🇬SG VIP  :  Rp 2.000   (7 HARI)
🇸🇬SG VIP  :  Rp 3.500   (15 HARI)
🇸🇬SG VIP  :  Rp 5.000   (22 HARI) 
🇸🇬SG VIP  :  Rp 7.000   (30 HARI)
🇸🇬SG VIP :  Rp 15.000  (60 HARI) 
2. vvip.sgpremium.my.id
🇸🇬SG VVIP : Rp 2.000  (3 HARI)
🇸🇬SG VVIP : Rp 3.500  (7 HARI)
🇸🇬SG VVIP : Rp 5.000  (15 HARI)
🇸🇬SG VVIP :  Rp 7.000   (22 HARI) 
🇸🇬SG VVIP : Rp 10.000  (30 HARI)
🇸🇬SG VVIP : Rp 20.000  (60 HARI) 
====================================
Khusus Pulsa : ↙️
+5k
====================================
• MINTA CONFIG MENTAHAN Rp 1.000
• CONFIG PREMIUM DARI SAYA GRATIS
===================================
✅BISA TRIAL DULU
===================================
*✅KELEBIHAN BELI AKUN PREMIUM✅*
Nonton YouTube Lancar  4K✓
Server Tidak Gampang Error✓
Buat download fast speed✓
ANTI RECONNECT✓
Support Video Call (RIQUES CONFIG/udp 7200)✓
Support GAME (TERGANTUNG TKP)✓
Koneksi stabil ✓
Fast Connect ✓
Garansi 100%✓
Bonus Config✓
DLL
==========================================
⚙️PENGATURAN PEMBELI⚙️
NO DDOS !!!
NO HACKING !!! 
NO CARDING !!!
NO TORRENT !!!
NO SPAMMING !!! 
NO PLAYING PLAYSTATION !!!
MAX 2 Device 
*Melanggar AUTO BAN!!!*                                 
==========================================
☎️MINAT ?? HUBUNGI : 
✅WhatsApp : wa.me/+6281327393959 
✅Telegram   : https://t.me/ARI_VPN_STORE
✅100% Amanah🙏
✅SUDAH TERPERCAYA 😉`
let btn_menu = [
{buttonId: `${prefix}proses`, buttonText: { displayText: 'BUYðŸ›’' }, type: 1 },
]
dryan.sendMessage(from,
{text: teq,
buttons: btn_menu},
{quoted: msg})
}
break
case 'id':
case 'sshid1':{
let teq =`*🔰👑𝗥𝗔𝗝𝗔 𝗦𝗘𝗩𝗘𝗥 𝗣𝗥𝗘𝗠𝗜𝗨𝗠👑🔰*
=================================
*🥇𝙱𝚈 𝙰𝚁𝙸 𝚅𝙿𝙽 𝚂𝚃𝙾𝚁𝙴🥇*
=================================
PILIH MODE INJECT NYA          
1. SSH/OPEN SSH/ SelowDns Account
2. Xray/Vmess Account
3. Xray/Vless Account
4. Trojan Account
5. Sodosok WS/GRPC Account       
=================================                                      
*SERVER INDONESIA BUKA✓*
📝LIST HARGA & SERVER :
1. nusa.idpremium.my.id
ISP : Media Antar Nusa PT.
🇮🇩ID NUSA :  Rp 2.000   (3 HARI)
🇮🇩ID NUSA  :  Rp 3.500   (7 HARI)
🇮🇩ID NUSA  :  Rp 5.000  (15 HARI)
🇮🇩ID NUSA  :  Rp 7.000   (22 HARI) 
🇮🇩ID NUSA  :  Rp 10.000   (30 HARI)
🇮🇩ID NUSA :  Rp 20.000  (60 HARI) 
====================================
Khusus Pulsa : ↙️
+5k
====================================
• MINTA CONFIG MENTAHAN Rp 1.000
• CONFIG PREMIUM DARI SAYA GRATIS
====================================
✅BISA TRIAL DULU
====================================
*✅KELEBIHAN BELI AKUN PREMIUM✅*
Nonton YouTube Lancar  4K✓
Server Tidak Gampang Error✓
Buat download fast speed✓
ANTI RECONNECT✓
Support Video Call (RIQUES CONFIG/udp 7200)✓
Support GAME (TERGANTUNG TKP)✓
Koneksi stabil ✓
Fast Connect ✓
Garansi 100%✓
Bonus Config✓
DLL
==========================================
⚙️PENGATURAN PEMBELI⚙️
NO DDOS !!!
NO HACKING !!! 
NO CARDING !!!
NO TORRENT !!!
NO SPAMMING !!! 
NO PLAYING PLAYSTATION !!!
MAX 2 Device 
*Melanggar AUTO BAN!!!*                                 
==========================================
☎️MINAT ?? HUBUNGI : 
✅WhatsApp : wa.me/+6281327393959 
✅Telegram   : https://t.me/ARI_VPN_STORE
✅100% Amanah🙏
✅SUDAH TERPERCAYA 😉`
let btn_menu = [
{buttonId: `${prefix}proses`, buttonText: { displayText: 'BUY🛒' }, type: 1 },
]
dryan.sendMessage(from,
{text: teq,
buttons: btn_menu},
{quoted: msg})
}
break
case 'id1':
case 'sshid2':{
let teq = `*🔰👑𝗥𝗔𝗝𝗔 𝗦𝗘𝗩𝗘𝗥 𝗣𝗥𝗘𝗠𝗜𝗨𝗠👑🔰*
=================================
*🥇𝙱𝚈 𝙰𝚁𝙸 𝚅𝙿𝙽 𝚂𝚃𝙾𝚁𝙴🥇*
=================================
PILIH MODE INJECT NYA          
1. SSH/OPEN SSH/ SelowDns Account
2. Xray/Vmess Account
3. Xray/Vless Account
4. Trojan Account
5. Sodosok WS/GRPC Account       
=================================                                      
*SERVER INDONESIA BUKA✓*
📝LIST HARGA & SERVER :
1. nusa.idpremium.my.id
ISP : Media Antar Nusa PT.
🇮🇩ID NUSA :  Rp 2.000   (3 HARI)
🇮🇩ID NUSA  :  Rp 3.500   (7 HARI)
🇮🇩ID NUSA  :  Rp 5.000  (15 HARI)
🇮🇩ID NUSA  :  Rp 7.000   (22 HARI) 
🇮🇩ID NUSA  :  Rp 10.000   (30 HARI)
🇮🇩ID NUSA :  Rp 20.000  (60 HARI) 
====================================
Khusus Pulsa : ↙️
+5k
====================================
• MINTA CONFIG MENTAHAN Rp 1.000
• CONFIG PREMIUM DARI SAYA GRATIS
====================================
✅BISA TRIAL DULU
====================================
*✅KELEBIHAN BELI AKUN PREMIUM✅*
Nonton YouTube Lancar  4K✓
Server Tidak Gampang Error✓
Buat download fast speed✓
ANTI RECONNECT✓
Support Video Call (RIQUES CONFIG/udp 7200)✓
Support GAME (TERGANTUNG TKP)✓
Koneksi stabil ✓
Fast Connect ✓
Garansi 100%✓
Bonus Config✓
DLL
==========================================
⚙️PENGATURAN PEMBELI⚙️
NO DDOS !!!
NO HACKING !!! 
NO CARDING !!!
NO TORRENT !!!
NO SPAMMING !!! 
NO PLAYING PLAYSTATION !!!
MAX 2 Device 
*Melanggar AUTO BAN!!!*                                 
==========================================
☎️MINAT ?? HUBUNGI : 
✅WhatsApp : wa.me/+6281327393959 
✅Telegram   : https://t.me/ARI_VPN_STORE
✅100% Amanah🙏
✅SUDAH TERPERCAYA 😉`
let btn_menu = [
{buttonId: `${prefix}proses`, buttonText: { displayText: 'BUY🛒' }, type: 1 },
]
dryan.sendMessage(from,
{text: teq,
buttons: btn_menu},
{quoted: msg})
}
break
case 'p':
case 'proses':{
let tek = (`「 *TRANSAKSI PENDING* 」\n\n\`\`\`📆 TANGGAL : ${tanggal}\n⌚ JAM     : ${jam}\n✨ STATUS  : Pending\`\`\`\n\n*--------------------------*\n\n*Pesanan ini akan diproses manual oleh admin,* *Tunggu admin memprosesnya🙏*\n*Atau Chat : Wa.me//${setting.kontakOwner}*`)
let btn_menu = [
{buttonId: `${prefix}aokeguwgw`, buttonText: { displayText: 'OKE SAYA TUNGGU👍' }, type: 1 },
]
dryan.sendMessage(from,
{text: tek,
buttons: btn_menu})
dryan.sendMessage(`${setting.ownerNumber}`, {text: `*👋HALLO OWNER KU, ADA YANG ORDER NIH*\n\n*DARI* : ${sender.split('@')[0]}`})
}
break
case 'd':
case 'done':{
if (!isOwner && !fromMe) return reply('Ngapain..?')
let tek = (`「 *TRANSAKSI BERHASIL* 」\n\n\`\`\`📆 TANGGAL : ${tanggal}\n⌚ JAM     : ${jam}\n✨ STATUS  : Berhasil\`\`\`\n\nTerimakasih Telah order di 𝙰𝚁𝙸 𝚅𝙿𝙽 𝚂𝚃𝙾𝚁𝙴\nNext Order ya🙏`)
let btn_menu = [
{buttonId: `${prefix}aokeguwgw`, buttonText: { displayText: 'OKE THENKS👍' }, type: 1 },
]
dryan.sendMessage(from,
{text: tek,
buttons: btn_menu})
}
break
case 'tambah':
if (!q) return reply(`Gunakan dengan cara ${command} *angka* *angka*\n\n_Contoh_\n\n${command} 1 2`)
var num_one = q.split(' ')[0]
var num_two = q.split(' ')[1]
if (!num_one) return reply(`Gunakan dengan cara ${prefix+command} *angka* *angka*\n\n_Contoh_\n\n${prefix+command} 1 2`)
if (!num_two) return reply(`Gunakan dengan cara ${prefix+command} *angka* *angka*\n\n_Contoh_\n\n${prefix+command} 1 2`)
var nilai_one = Number(num_one)
var nilai_two = Number(num_two)
reply(`${nilai_one + nilai_two}`)
break
case 'kurang':
if (!q) return reply(`Gunakan dengan cara ${command} *angka* *angka*\n\n_Contoh_\n\n${command} 1 2`)
var num_one = q.split(' ')[0]
var num_two = q.split(' ')[1]
if (!num_one) return reply(`Gunakan dengan cara ${prefix+command} *angka* *angka*\n\n_Contoh_\n\n${prefix+command} 1 2`)
if (!num_two) return reply(`Gunakan dengan cara ${prefix+command} *angka* *angka*\n\n_Contoh_\n\n${prefix+command} 1 2`)
var nilai_one = Number(num_one)
var nilai_two = Number(num_two)
reply(`${nilai_one - nilai_two}`)
break
case 'kali':
if (!q) return reply(`Gunakan dengan cara ${command} *angka* *angka*\n\n_Contoh_\n\n${command} 1 2`)
var num_one = q.split(' ')[0]
var num_two = q.split(' ')[1]
if (!num_one) return reply(`Gunakan dengan cara ${prefix+command} *angka* *angka*\n\n_Contoh_\n\n${prefix+command} 1 2`)
if (!num_two) return reply(`Gunakan dengan cara ${prefix+command} *angka* *angka*\n\n_Contoh_\n\n${prefix+command} 1 2`)
var nilai_one = Number(num_one)
var nilai_two = Number(num_two)
reply(`${nilai_one * nilai_two}`)
break
case 'bagi':
if (!q) return reply(`Gunakan dengan cara ${prefix+command} *angka* *angka*\n\n_Contoh_\n\n${command} 1 2`)
var num_one = q.split(' ')[0]
var num_two = q.split(' ')[1]
if (!num_one) return reply(`Gunakan dengan cara ${prefix+command} *angka* *angka*\n\n_Contoh_\n\n${prefix+command} 1 2`)
if (!num_two) return reply(`Gunakan dengan cara ${prefix+command} *angka* *angka*\n\n_Contoh_\n\n${prefix+command} 1 2`)
var nilai_one = Number(num_one)
var nilai_two = Number(num_two)
reply(`${nilai_one / nilai_two}`)
break
case 'hidetag':
if (!isGroup) return reply(mess.OnlyGroup)
if (!isGroupAdmins) return reply(mess.GrupAdmin)
if (!isBotGroupAdmins) return reply(mess.BotAdmin)
let mem = [];
groupMembers.map( i => mem.push(i.id) )
dryan.sendMessage(from, { text: q ? q : '', mentions: mem })
break
case 'antilink':{
if (!isGroup) return reply(mess.OnlyGroup)
if (!isGroupAdmins) return reply(mess.GrupAdmin)
if (!isBotGroupAdmins) return reply(mess.BotAdmin)
if (!args[0]) return reply(`Kirim perintah #${command} _options_\nOptions : on & off\nContoh : #${command} on`)
if (args[0] == 'ON' || args[0] == 'on' || args[0] == 'On') {
if (isAntiLink) return reply('Antilink sudah aktif')
antilink.push(from)
fs.writeFileSync('./database/antilink.json', JSON.stringify(antilink, null, 2))
reply('Successfully Activate Antilink In This Group')
} else if (args[0] == 'OFF' || args[0] == 'OF' || args[0] == 'Of' || args[0] == 'Off' || args[0] == 'of' || args[0] == 'off') {
if (!isAntiLink) return reply('Antilink belum aktif')
let anu = antilink.indexOf(from)
antilink.splice(anu, 1)
fs.writeFileSync('./database/antilink.json', JSON.stringify(antilink, null, 2))
reply('Successfully Disabling Antilink In This Group')
} else { reply('Kata kunci tidak ditemukan!') }
}
break
case 'group':
case 'grup':
if (!isGroup) return reply(mess.OnlyGroup)
if (!isGroupAdmins) return reply(mess.GrupAdmin)
if (!isBotGroupAdmins) return reply(mess.BotAdmin)
if (!q) return reply(`Kirim perintah #${command} _options_\nOptions : close & open\nContoh : #${command} close`)
if (args[0] == "close") {
dryan.groupSettingUpdate(from, 'announcement')
reply(`Sukses mengizinkan hanya admin yang dapat mengirim pesan ke grup ini`)
} else if (args[0] == "open") {
dryan.groupSettingUpdate(from, 'not_announcement')
reply(`Sukses mengizinkan semua peserta dapat mengirim pesan ke grup ini`)
} else {
reply(`Kirim perintah #${command} _options_\nOptions : close & open\nContoh : #${command} close`)
}
break
case 'kick':
if (!isGroup) return reply(mess.OnlyGroup)
if (!isGroupAdmins) return reply(mess.GrupAdmin)
if (!isBotGroupAdmins) return reply(mess.BotAdmin)
var number;
if (mentionUser.length !== 0) {
number = mentionUser[0]
dryan.groupParticipantsUpdate(from, [number], "remove")
.then( res => 
reply(`*Sukses mengeluarkan member..!*`))
.catch((err) => reply(mess.error.api))
} else if (isQuotedMsg) {
number = quotedMsg.sender
dryan.groupParticipantsUpdate(from, [number], "remove")
.then( res => 
reply(`*Sukses mengeluarkan member..!*`))
.catch((err) => reply(mess.error.api))
} else {
reply(`Tag atau balas pesan orang yang ingin dikeluarkan dari grup`)
}
break
case 'block':{
if (!isOwner && !fromMe) return reply(mess.OnlyOwner)
if (!q) return reply(`Ex : ${prefix+command} Nomor Yang Ingin Di Block\n\nContoh :\n${prefix+command} 628xxxx`)
let nomorNya = q
await conn.updateBlockStatus(`${nomorNya}@s.whatsapp.net`, "block") // Block user
reply('Sukses Block Nomor')
}
break
case 'unblock':{
if (!isOwner && !fromMe) return reply(mess.OnlyOwner)
if (!q) return reply(`Ex : ${prefix+command} Nomor Yang Ingin Di Unblock\n\nContoh :\n${prefix+command} 628xxxx`)
let nomorNya = q
await conn.updateBlockStatus(`${nomorNya}@s.whatsapp.net`, "unblock")
reply('Sukses Unblock Nomor')
}
break
case 'shop': case 'list':
if (!isGroup) return reply(mess.OnlyGrup)
if (db_respon_list.length === 0) return reply(`Belum ada list message di database`)
if (!isAlreadyResponListGroup(from, db_respon_list)) return reply(`Belum ada list message yang terdaftar di group ini`)
var arr_rows = [];
for (let x of db_respon_list) {
if (x.id === from) {
arr_rows.push({
title: x.key,
rowId: x.key
})
}
}
var listMsg = {
text: `Hai @${sender.split("@")[0]}`,
buttonText: 'click here',
footer: `*list from ${groupName}*`,
mentions: [sender],
sections: [{
title: groupName, rows: arr_rows
}]
}
dryan.sendMessage(from, listMsg)
break
case 'addlist':
if (!isGroup) return reply(mess.OnlyGrup)
if (!isGroupAdmins && !isOwner) return reply(mess.GrupAdmin)
var args1 = q.split("@")[0]
var args2 = q.split("@")[1]
if (!q.includes("@")) return reply(`Gunakan dengan cara ${command} *key@response*\n\n_Contoh_\n\n#${command} tes@apa`)
if (isAlreadyResponList(from, args1, db_respon_list)) return reply(`List respon dengan key : *${args1}* sudah ada di group ini.`)
addResponList(from, args1, args2, false, '-', db_respon_list)
reply(`Berhasil menambah List menu : *${args1}*`)
break
case 'dellist':{
if (!isGroup) return reply(mess.OnlyGrup)
if (!isGroupAdmins && !isOwner) return reply(mess.GrupAdmin)
if (db_respon_list.length === 0) return reply(`Belum ada list message di database`)
var arr_rows = [];
for (let x of db_respon_list) {
if (x.id === from) {
arr_rows.push({
title: x.key,
rowId: `#hapuslist ${x.key}`
})
}
}
var listMsg = {
text: `Hai @${sender.split("@")[0]}`,
buttonText: 'pilih disini',
footer: 'Silahkan pilih list yg mau dihapus',
mentions: [sender],
sections: [{
title: groupName, rows: arr_rows
}]
}
dryan.sendMessage(from, listMsg)
}
break
case 'sc':
case 'script':
case 'scbot':
case 'scriptbot':{
delResponList(from, q, db_respon_list)
reply(`*DI SC PRIBADI HANYA MEMILIKI UANG 20K`)
}
break
case 'hapuslist':
delResponList(from, q, db_respon_list)
reply(`Sukses delete list message dengan key *${q}*`)
break
default:
if ((budy) && ["assalamu'alaikum", "Assalamu'alaikum", "Assalamualaikum", "assalamualaikum", "Assalammualaikum", "assalammualaikum", "Asalamualaikum", "asalamualaikum", "Asalamu'alaikum", " asalamu'alaikum"].includes(budy) && !isCmd) {
dryan.sendMessage(from, { text: `${pickRandom(["Wa'alaikumussalam","Wa'alaikumussalam Wb.","Wa'alaikumussalam Wr. Wb.","Wa'alaikumussalam Warahmatullahi Wabarakatuh"])}`})
}
if ((budy) && ["tes", "Tes", "TES", "Test", "test", "ping", "Ping"].includes(budy) && !isCmd) {
dryan.sendMessage(from, { text: `${runtime(process.uptime())}*⏰`})
}

}} catch (err) {
console.log(color('[ERROR]', 'red'), err)
const isGroup = msg.key.remoteJid.endsWith('@g.us')
const sender = isGroup ? (msg.key.participant ? msg.key.participant : msg.participant) : msg.key.remoteJid
const moment = require("moment-timezone");
const jam = moment.tz('asia/jakarta').format('HH:mm:ss')
const tanggal = moment().tz("Asia/Jakarta").format("ll")
let kon_erorr = {"tanggal": tanggal, "jam": jam, "error": err, "user": sender}
db_error.push(kon_erorr)
fs.writeFileSync('./database/error.json', JSON.stringify(db_error))
var errny =`*SERVER ERROR*
*Dari:* @${sender.split("@")[0]}
*Jam:* ${jam}
*Tanggal:* ${tanggal}
*Tercatat:* ${db_error.length}
*Type:* ${err}`
dryan.sendMessage(setting.ownerNumber, {text:errny, mentions:[sender]})
}}