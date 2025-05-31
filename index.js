#!/usr/bin/env node
/* eslint-disable no-unused-vars */
const { spawn } = require("child_process");
const { token, demoChannelId } = require("./config.json");
const { Client, Events, GatewayIntentBits } = require("discord.js");

const LABELS = ["religion", "age", "ethnicity", "gender", "not bullying"];

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.once(Events.ClientReady, () => {
  console.log(`Ready! Logged in as ${client.user.tag}`);
});

// ——— ONLY ONE MessageCreate listener ———
client.on(Events.MessageCreate, async message => {
  // 1) only in your demo channel
  if (message.channelId !== demoChannelId) return;

  // 2) ignore bots & require a mention
  //if (message.author.bot || !message.mentions.has(client.user)) return;
  if (message.author.id === client.user.id) return;


  // 3) strip out the mention
  const text = message.content
    .replace(`<@${client.user.id}>`, "")
    .trim();

  // 4) spawn your Python script exactly once per incoming message
  console.log("[DEBUG] classify:", text);
  const child = spawn("python3", ["classify.py", text], { cwd: __dirname });

  let out = "";
  child.stdout.on("data", chunk => (out += chunk.toString()));
  child.stderr.on("data", chunk => console.error("[PY STDERR]", chunk.toString()));

  child.on("close", code => {
    console.log(`[DEBUG] python exit=${code}, out=⟨${out.trim()}⟩`);
    if (code !== 0) return message.reply("⚠️ Classifier failed.");

    const idx = parseInt(out.trim(), 10);
    if (isNaN(idx)) {
      return message.reply("⚠️ Got weird output from the classifier.");
    }

    // 5) send exactly one reply per message
    if (idx === LABELS.length - 1) {
      message.reply("✅ No bullying detected.");
    } else {
      message.reply(`🚨 CyCop detected ${LABELS[idx]}-based harassment!`);
    }
  });
});

console.log("Logging in…");
client.login(token);
