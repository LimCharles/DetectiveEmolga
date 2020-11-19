const Discord = require('discord.js');
const client = new Discord.Client();
client.login('Nzc4NTg1NzMyMzE4NzU2ODc0.X7UIeA.KzTqZK9XoZWk4b27FCom81pXn6Y');

var mainchannel;
const channels = [];
client.on('message', (message) => {
	if (message.content == '!channel') {
		var giveawaychannel = message.channel;
		var giveawayserver = message.guild;
		for (let i = 0; i < channels.length; i++) {
			if (channels[i][1] == giveawayserver.name) {
				channels[i][0] = giveawaychannel.name;
				giveawaychannel.send('This is now the rare-drops channel!');
				return; // exit and reply with message that rare-drop channel changed
			} 
		} //checks if server already has a rare-drops channel, then declares the new rare-drops channel
		channels.push([giveawaychannel.name,giveawayserver.name]);
		giveawaychannel.send('This is now the rare-drops channel!');
	} // working as intended! A/O 18/11/2020

	if (!(message.author.bot)) {return;} // return if message was not sent by a bot

	if (message.author.id == '778585732318756874') {return;} // return if message was sent by itself

 	if (channels.length == 0) {message.channel.send("You haven't set a rare-drops channel!"); return; } // return if channels has no channel 

	var check = false;
	for (let i = 0; i < channels.length; i++) {
		if (message.guild.name == channels[i][1]) {
			check = true;
		} // check becomes true when it finds one match
		if ((check == false) && i == (channels.length-1)) {
			message.channel.send("You haven't set a rare-drops channel!");
			return;
		} // return if rare-drops channel is not declared in that server
	}

	var pokembed = message.embeds[0];

	if (typeof pokembed != 'undefined') {
		var pokemon = JSON.stringify(pokembed);	
		if (pokemon.includes('"footer":{"text":"Legendary (')) {
			message.pin({ reason: 'Legendary found!' });
			pokembed.description = pokembed.description.replace(/<.*?>/g, ' ');
			for (let i = 0; i < channels.length; i++) {
				if (message.guild.name == channels[i][1]) {
					mainchannel = message.guild.channels.cache.find(c => c.name == channels[i][0]);
				} // find corresponding channel name from server name in channels
			}
			mainchannel.send(pokembed);
			mainchannel.send('A legendary was found in ' + message.channel.name + '!');
		}
		if (pokemon.includes('"footer":{"text":"Shiny (')) {
			message.pin({ reason: 'Shiny found!' });
			pokembed.description = pokembed.description.replace(/<.*?>/g, ' ');
			for (let i = 0; i < channels.length; i++) {
				if (message.guild.name == channels[i][1]) {
					mainchannel = message.guild.channels.cache.find(c => c.name == channels[i][0]);
				} // find corresponding channel name from server name in channels
			}
			mainchannel.send(pokembed);
			mainchannel.send('A shiny was found in ' + message.channel.name + '!');
		}
	} 
});
