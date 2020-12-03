require('dotenv').config()
const Discord = require('discord.js');
const client = new Discord.Client();
client.login(process.env.DISCORD_TOKEN);

const MongoClient = require('mongodb').MongoClient;
const uri = process.env.MONGO_URL;
const mongo = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true});

var mainchannel;
var collection;
const channels = [];
const filter = ({ServerName, ChannelName, LegendaryRole, ShinyRole}) => ({ServerName, ChannelName, LegendaryRole, ShinyRole});

mongo.connect( async () => {
    collection = mongo.db("ServerData").collection("SavedChannels");
    var dd = await collection.find().toArray();
    for (let i = 0; i < dd.length; i++ ) {
        channels.push(Object.values(filter(dd[i])));
	}
});

setInterval( async () => {
	datatobepassed = channels.map(x => {
		return {    
			ServerName: x[0],
			ChannelName: x[1],
			LegendaryRole: x[2],
			ShinyRole: x[3]
		}
	})
	await collection.deleteMany(({}));
	await collection.insertMany(datatobepassed);
}, 3600000);


client.on('message', (message) => {
	if (message.content == '!channel') {
		var giveawaychannel = message.channel;
		var giveawayserver = message.guild;
		for (let i = 0; i < channels.length; i++) {
			if (channels[i][0] == giveawayserver.name) {
				channels[i][1] = giveawaychannel.name;
				giveawaychannel.send('This is now the rare-drops channel!');
				return; // exit and reply with message that rare-drop channel changed
			} 
		} //checks if server already has a rare-drops channel, then declares the new rare-drops channel
		channels.push([giveawayserver.name,giveawaychannel.name,null,null]); //declares new channel for that server
		giveawaychannel.send('This is now the rare-drops channel!');
		return; // exit and reply with message that rare-drop channel is declared
	} // working as intended! A/O 18/11/2020

	if (message.content.startsWith('!mention')) {
		const args = message.content.trim().split(' ');
		for (let i = 0; i < channels.length; i++) {
			if (message.guild.name == channels[i][0]) {
				switch(args[1]) {
					case 'al':
						channels[i][2] = args[2];
						message.channel.send(channels[i][2] + ' will now be pinged for legendaries.');
						return;
					case 'as':
						channels[i][3] = args[2];
						message.channel.send(channels[i][3] + ' will now be pinged for shinies.');
						return;
					case 'rl':
						message.channel.send(channels[i][2] + ' will no longer be pinged for legendaries.');
						delete channels[i][2]
						return;
					case 'rs':
						message.channel.send(channels[i][3] + ' will no longer be pinged for shinies.');
						delete channels[i][3]
						return;
					case 'check':
						console.table(channels);
						if (channels[i][2] != null) {
							message.channel.send(channels[i][2] + ' is the role for legendaries.');
						} else {
							message.channel.send('There is no role for legendary drops.')
						}
						if (channels[i][3] != null) {
							message.channel.send(channels[i][3] + ' is the role for shinies.');
						} else {
							message.channel.send('There is no role for shiny drops.')
						}
						return;
					default:
						message.channel.send('Invalid format, please try again!');
						return;
				}
			} 
		}
		message.channel.send("You haven't set a rare-drops channel!");
		return;
	}

	if (!(message.author.bot)) {return;} // return if message was not sent by a bot

	if (message.author.id == '778585732318756874') {return;} // return if message was sent by itself

// deprecated since channels.length is always > 1 now 	if (channels.length == 0) {message.channel.send("You haven't set a rare-drops channel! Please use !channel in your rare drops channel!"); return; } // return if channels has no channel 

	var check = false;
	for (let i = 0; i < channels.length; i++) {
		if (message.guild.name == channels[i][0]) {
			check = true;
		} // check becomes true when it finds one match
		if ((check == false) && i == (channels.length-1)) {
			message.channel.send("You haven't set a rare-drops channel! Please use !channel in your rare drops channel!");
			return;
		} // return if rare-drops channel is not declared in that server
	}

	var pokembed = message.embeds[0];

	if (typeof pokembed != 'undefined') {
		var pokemon = JSON.stringify(pokembed);	
		if (pokemon.includes('"footer":{"text":"Legendary (')) {
			message.pin({ reason: 'Legendary found!' });
			pokembed.description = pokembed.description.replace(/<.*?>/g, ' ');
			pokembed.addField('​​\u200b','This Pokémon was found in: ' + `[${message.channel.name}](${message.url})`);
			for (let i = 0; i < channels.length; i++) {
				if (message.guild.name == channels[i][0]) {
					mainchannel = message.guild.channels.cache.find(c => c.name == channels[i][1]);
					if (channels[i][2] == undefined) {
						mainchannel.send(pokembed);
						mainchannel.send('A legendary was found in ' + message.channel.name + '!');
						break;
					} else {
						mainchannel.send(pokembed);
						mainchannel.send(channels[i][2] + ' A legendary was found in ' + message.channel.name + '!');
						break;
					}
				} 
			}
		}
		if (pokemon.includes('"footer":{"text":"Shiny (')) {
			message.pin({ reason: 'Shiny found!' });
			pokembed.description = pokembed.description.replace(/<.*?>/g, ' ');
			pokembed.addField('​​\u200b','This Pokémon was found in: ' + `[${message.channel.name}](${message.url})`);
			for (let i = 0; i < channels.length; i++) {
				if (message.guild.name == channels[i][0]) {
					mainchannel = message.guild.channels.cache.find(c => c.name == channels[i][1]);
					if (channels[i][3] == undefined) {
						mainchannel.send(pokembed);
						mainchannel.send('A shiny was found in ' + message.channel.name + '!');
					} else {
						mainchannel.send(pokembed);
						mainchannel.send(channels[i][3] + ' A shiny was found in ' + message.channel.name + '!');
					}
				} 
			}
		}
	} 
});
