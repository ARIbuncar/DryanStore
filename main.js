"use strict";
const { default: makeWASocket, DisconnectReason, useSingleFileAuthState, makeInMemoryStore, downloadContentFromMessage, jidDecode, generateForwardMessageContent, generateWAMessageFromContent } = require("@adiwajshing/baileys")
const fs = require("fs");
const chalk = require('chalk')
const logg = require('pino')
const { serialize, fetchJson, sleep, getBuffer } = require("./lib/myfunc");
const { nocache, uncache } = require('./lib/chache.js');

let setting = JSON.parse(fs.readFileSync('./setting.json'));
let session = `./${setting.sessionName}.json`
const { state, saveState } = useSingleFileAuthState(session)

const memory = makeInMemoryStore({ logger: logg().child({ level: 'fatal', stream: 'store' }) })

const connectToWhatsApp = async () => {
const dryan = makeWASocket({
printQRInTerminal: true,
logger: logg({ level: 'fatal' }),
browser: ['Dryan-MD','Safari','1.0.0'],
auth: state
})
memory.bind(dryan.ev)

dryan.ev.on('messages.upsert', async m => {
var msg = m.messages[0]
if (!m.messages) return;
if (msg.key && msg.key.remoteJid == "status@broadcast") return
msg = serialize(dryan, msg)
msg.isBaileys = msg.key.id.startsWith('BAE5') || msg.key.id.startsWith('3EB0')
require('./index')(dryan, msg, m, setting, memory)
})

dryan.ev.on('creds.update', () => saveState)

console.log(chalk.yellow(`${chalk.red('[ Made By Dryan-MD ]')}\n\n${chalk.italic.magenta(`SV Dryan-MD\nNomor: 089513081052\nSebut Nama👆,`)}\n\n\n${chalk.red(`ADMIN SEDIA`)}\n${chalk.white(`-PANEL RUN BOT\n-SCRIT CREATE PANEL\n-SCRIPT MD\n-THEMES PANEL\n`)}`))
 

dryan.reply = (from, content, msg) => dryan.sendMessage(from, { text: content }, { quoted: msg })

dryan.ev.on('connection.update', (update) => {
console.log('Connection update:', update)
if (update.connection === 'open') 
console.log("Connected with " + dryan.user.id)
else if (update.connection === 'close')
connectToWhatsApp()
})



dryan.sendImage = async (jid, path, caption = '', quoted = '', options) => {
let buffer = Buffer.isBuffer(path) ? path : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split`,`[1], 'base64') : /^https?:\/\//.test(path) ? await (await getBuffer(path)) : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0)
return await dryan.sendMessage(jid, { image: buffer, caption: caption, ...options }, { quoted })
}

dryan.decodeJid = (jid) => {
if (!jid) return jid
if (/:\d+@/gi.test(jid)) {
let decode = jidDecode(jid) || {}
return decode.user && decode.server && decode.user + '@' + decode.server || jid
} else return jid
}
return dryan
}
connectToWhatsApp()
.catch(err => console.log(err))
