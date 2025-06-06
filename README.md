
# CyCop Discord Bot

**CyCop** is a Discord bot that leverages a fine-tuned BERT classifier to detect and flag cyberbullying in real time.
It resides in a designated channel on your Discord server. Whenever someone mentions the bot, it spawns a lightweight Python process that runs a BERT‐based classifier on the message content. CyCop then replies with one of two responses:

- 🚨 **CyCop detected `<type>`-based harassment!**  
- ✅ **No bullying detected.**

This repository contains all the code and configuration needed to stand up CyCop on your own Discord server.

---

## Table of Contents

1. [Features](#features)  
2. [Prerequisites](#prerequisites)  
3. [File Structure](#file-structure)  
4. [Setup & Installation](#setup--installation)  
   - [1. Clone the Repository](#1-clone-the-repository)  
   - [2. Python Environment & Model Files](#2-python-environment--model-files)  
   - [3. Discord Bot Registration](#3-discord-bot-registration)  
   - [4. Configuration](#4-configuration)  
   - [5. Install Dependencies](#5-install-dependencies)  
   - [6. Deploy Slash Commands (Optional)](#6-deploy-slash-commands-optional)  
5. [Running the Bot](#running-the-bot)  
6. [Usage Examples](#usage-examples)  
7. [Troubleshooting & Tips](#troubleshooting--tips)  
8. [Contact](#contact)  

---

## Features

- 🕵️ **Harassment Detection**  
  - Fine-tuned BERT classifies incoming messages into five labels:  
    1. `religion`  
    2. `age`  
    3. `ethnicity`  
    4. `gender`  
    5. `not bullying`  
  - Model outputs are returned as integers (0–4) and mapped to human-readable replies.

-  **Discord Integration**  
    * Listens for `@CyCop` mentions in a single “demo” channel.  
    * Replies once per message with either a harassment alert or “No bullying detected.”  

-  **Lightweight Python Classifier**  
    * `classify.py` loads a Hugging Face BERT checkpoint (or TorchScript export) and returns a label.  
    * Node.js “spawns” this script for each incoming message—keeping the Discord bot code simple and asynchronous.

-  **Optional Slash Commands**  
    * Supports `/ask` as a stubbed command, which can be extended to query the bot for other tasks.  
    * Commands live under `commands/` and can be deployed with `node deploy-commands.js`.

---

## Prerequisites

1. **Node.js & npm** (v14+ recommended)  
2. **Python 3.8+** (with `pip`)  
3. A **Discord application** with a Bot account (Bot Token, appropriate intents enabled)  
4. A fine-tuned BERT model checkpoint (either Hugging Face format or .pt file)
* If using Hugging Face format, the checkpoint directory must include:
```
  model_save/
  ├── config.json
  ├── pytorch_model.bin
  ├── vocab.txt
  ├── tokenizer_config.json
  └── special_tokens_map.json
```
* If using a .pt file (you ran the cells in bertbot.ipynb), CyCop will use the raw PyTorch model state dictionary. Be sure that classify.py is configured to interpret this correctly. The files in your directory should look like this:
     ```
     model_save/
	  ├── bert_classifier_state_dict.pt
	  ├── cycop_model.pt
	  ├── special_tokens_map.json
	  ├── tokenizer_config.json
	  └── vocab.txt
---

## File Structure

```
CyCopDiscordBot/
├── model_save/                  # Fine-tuned BERT checkpoint
│  ├── bert_classifier_state_dict.pt
|  |── cycop_model.pt
|  ├── special_tokens_map.json
|  ├── tokenizer_config.json
|  └── vocab.txt
├── classify.py                  # Python script to run classifier
├── index.js                     # Discord bot core logic
├── deploy-commands.js           # Slash command registration script
├── config.json                  # Bot token and channel config
├── package.json                 # Node.js dependency list
├── nodemon.json                 # (Optional) development config
└── README.md                    # You're here
```

---

## Setup & Installation

### 1. Clone the Repository

bash
git clone https://github.com/AnikaGBasu/CyCopDiscordBot.git
cd CyCopDiscordBot

### 2. Python Environment & Model Files
1. Create a Python virtual environment (strongly recommended):

	python3 -m venv venv
	source venv/bin/activate      (for Linux/macOS)

    .\venv\Scripts\activate       (for Windows PowerShell)

3. Install Python dependencies:
	pip install --upgrade pip
	pip install torch transformers

4. Run all the cells in the bertbot.ipynb file. By default, the model will be saved in the same repository if you are using editors like Visual Studio Code. Otherwise, place your fine-tuned BERT checkpoint in the directory. The folder model_save/ must contain these five files:
  ```
   model_save/
	├── bert_classifier_state_dict.pt
	├── cycop_model.pt
	├── special_tokens_map.json
	├── tokenizer_config.json
	└── vocab.txt
  ```

### 3. Discord Bot Registration
1. Go to the Discord Developer Portal, create a new application, and then click “Bot” → “Add Bot”.
2. Copy the Bot Token under “Bot → Token” (you’ll need it later).
3. Under “Privileged Gateway Intents”, enable:
    * Message Content Intent
    * (Optional) Server Members Intent, if your bot ever needs to read member data.
4. Under “OAuth2 → URL Generator”, select these scopes & permissions:
    * Scope: bot
    * Bot Permissions:
        * Send Messages
        * Read Message History
        * Use Slash Commands (if you plan on slash commands)
5. Copy the generated invite URL, paste into your browser, and add the bot to your desired server.
6. In Discord, enable Developer Mode (User Settings → Advanced → Developer Mode), then right-click your demo channel → Copy ID. This is the demoChannelId.

### 4. Configuration
1. Copy the template for config.json and fill in your values.
  {
	 "token": "YOUR_DISCORD_BOT_TOKEN_HERE",
	 "demoChannelId": "123456789012345678"
	}
    * token: Your Discord Bot Token from the Developer Portal.
    * demoChannelId: The ID of the specific channel where CyCop should listen for @CyCop mentions.
### 5. Install Dependencies
Install Node.js dependencies:
npm install
This will install:
* discord.js for interacting with the Discord API
* python-shell (optional) if you prefer that over child_process.spawn
* Other utility packages listed in package.json
### 6. Deploy Slash Commands (Optional)
If you want a slash command (e.g., /ask) in addition to mention-based classification, run:
node deploy-commands.js
This script scans all files in the commands/ directory, reads their JSON definitions, and registers them with Discord. You only need to run it:
* Once initially (to register commands)
* Again whenever you modify or add a command file under commands/

## Running the Bot

1. Ensure your Python virtual environment is activated (if you created one):
	source venv/bin/activate   (for macOS/Linux)
	 .\venv\Scripts\activate   (for Windows PowerShell)

2. Launch the bot: node index.js

3. You should see:
	Logging in…
	Ready! Logged in as "CyCop#1234"

4. In Discord, navigate to your configured demo channel and type: @CyCop This is a test message

5. CyCop will reply with one of:
    * 🚨 CyCop detected <type>-based harassment!
    * ✅ No bullying detected.

## Usage Examples
### Mention-Based Classification
* User: @CyCop you are an idiot
* CyCop: 🚨 CyCop detected age-based harassment!
Code flow:
1. index.js sees a MessageCreate event.
2. Verifies that message.channelId === demoChannelId.
3. Verifies message.author.bot === false and that the bot was mentioned.
4. Strips out <@CyCopID> from the content, leaving only the user’s text.
5. Spawns python3 classify.py "you are an idiot".
6. classify.py:
    * Loads the saved BERT checkpoint from model_save/.
    * Tokenizes the input, runs the model, prints a label index 0–4.
7. Back in index.js, read the integer on stdout, map it to one of:
    * 0 → religion
    * 1 → age
    * 2 → ethnicity
    * 3 → gender
    * 4 → not bullying
8. Reply accordingly.

### Slash Command (Optional)
If you added a file under commands/ask.js:
```
// commands/ask.js
const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ask")
    .setDescription("Ask CyCop a question"),
  async execute(interaction) {
    // Example stub: reply with a placeholder
    await interaction.reply("CyCop is here to listen!");
  },
};
```
To register the command, run:
bash
```
node deploy-commands.js
```
Then, in Discord, type:
```
/ask How are you?
```
CyCop will respond with:
```
CyCop is here to listen!
```

## Troubleshooting & Tips
### 1. “Used disallowed intents” Error on Start
If you see:
Error: Used disallowed intents
It means your bot tried to subscribe to a Gateway Intent that isn’t enabled. To fix:
1. Go to the Discord Developer Portal.
2. Select your application → Bot → scroll to Privileged Gateway Intents.
3. Toggle Message Content Intent to ON.
4. Save changes and re-invite or re-start your bot.
### 2. Avoiding Infinite Reply Loops
* Always check at the top of your messageCreate handler: if (message.author.bot) return;
* if (message.author.id === client.user.id) return;
*  This ensures CyCop never responds to its own messages (or other bots). Without this guard, CyCop’s reply can re-trigger the listener.
### 3. “No bullying detected” for Every Message
* Likely Cause: model_save/ does not contain a full Hugging Face checkpoint. If you only saved a PyTorch state dict, classify.py falls back to returning 4 (“not bullying”) because it can’t load a proper model.
* Fix:
    1. Convert your raw state dict into a HF checkpoint. 

## Contact
Feel free to contact anika.ghosh.basu@gmail.com for any further questions
 
