const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ask')
		.setDescription('Replies with LLM-generated message!'),
	async execute(interaction) {
		// await interaction.reply('Lorem ipsum dolor amit!');
	},
};