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

const eggexcl = [
	'chingling',
	'bonsly',
	'mimejr',
	'happiny',
	'chatot',
	'munchlax',
	'riolu',
	'mantyke',
	'audino',
	'zorua',
	'emolga',
	'ferroseed',
	'golett',
	'pawniard',
	'larvesta',
	'pancham',
	'spritzee',
	'swirlix',
	'skrelp',
	'noibat',
	'rockruff',
	'mareanie',
	'wimpod',
	'carbink',
	'mimikyu'
];

const legends = [
	'articuno',
	'zapdos',
	'moltres',
	'raikou',
	'entei',
	'suicine',
	'regirock',
	'regice',
	'registeel',
	'latias',
	'latios',
	'uxie',
	'mesprit',
	'azelf',
	'heatran',
	'regigigas',
	'cresselia',
	'cobalion',
	'terrakion',
	'virizion',
	'tornadus',
	'thundurus',
	'landorus',
	'typenull',
	'silvally',
	'tapukoko',
	'tapulele',
	'tapubulu',
	'tapufini',
	'nihilego',
	'buzzwole',
	'pheromosa',
	'xurkitree',
	'celesteela',
	'kartana',
	'guzzlord',
	'poipole',
	'naganadel',
	'stakataka',
	'blacephalon',
	'kubfu',
	'urshifu',
	'regieleki',
	'regidrago',
	'glastrier',
	'spectrier',
	'mewtwo',
	'lugia',
	'hooh',
	'kyogre',
	'groudon',
	'rayquaza',
	'dialga',
	'palkia',
	'giratina',
	'reshiram',
	'zekrom',
	'kyurem',
	'xerneas',
	'yveltal',
	'zygarde',
	'cosmog',
	'cosmoem',
	'solgaleo',
	'lunala',
	'necrozma',
	'zacian',
	'zamazenta',
	'eternatus',
	'calyrex',
	'mew',
	'celebi',
	'jirachi',
	'deoxys',
	'phione',
	'manaphy',
	'darkrai',
	'shaymin',
	'arceus',
	'victini',
	'keldeo',
	'meloetta',
	'genesect',
	'diancie',
	'hoopa',
	'volcanion',
	'magearna',
	'marshadow',
	'zeraora',
	'meltan',
	'melmetal',
	'zarude'
]

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

	if (message.author.id != '664508672713424926') {return;} // return if message was not sent by pokemeow
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
					if (mainchannel == undefined) {
						console.log(channels[i][0]);
						console.log(channels[i][1]);
						return;
					}
					if (channels[i][2] == undefined) {
						mainchannel.send(pokembed);
						mainchannel.send('A legendary was found in ' + message.channel.name + '!');
						return;
					} else {
						mainchannel.send(pokembed);
						mainchannel.send(channels[i][2] + ' A legendary was found in ' + message.channel.name + '!');
						return;
					}
				} 
			}
		} //normal legendary spawn

		if (pokemon.includes('"footer":{"text":"Shiny (')) {
			message.pin({ reason: 'Shiny found!' });
			pokembed.description = pokembed.description.replace(/<.*?>/g, ' ');
			pokembed.addField('​​\u200b','This Pokémon was found in: ' + `[${message.channel.name}](${message.url})`);
			for (let i = 0; i < channels.length; i++) {
				if (message.guild.name == channels[i][0]) {
					mainchannel = message.guild.channels.cache.find(c => c.name == channels[i][1]);
					if (mainchannel == undefined) {
						console.log(channels[i][0]);
						console.log(channels[i][1]);
						return;
					}
					if (channels[i][3] == undefined) {
						mainchannel.send(pokembed);
						mainchannel.send('A shiny was found in ' + message.channel.name + '!');
						return;
					} else {
						mainchannel.send(pokembed);
						mainchannel.send(channels[i][3] + ' A shiny was found in ' + message.channel.name + '!');
						return;
					}
				} 
			}
		} //normal shiny spawn

		if ((pokemon.includes('hatched an Egg!","icon"')) && (pokemon.includes('shiny'))) {
			message.pin({ reason: 'Shiny hatched!' });
			pokembed.description = pokembed.description.replace(/<.*?>/g, ' ');
			pokembed.addField('​​\u200b','This Pokémon was hatched in: ' + `[${message.channel.name}](${message.url})`);
			for (let i = 0; i < channels.length; i++) {
				if (message.guild.name == channels[i][0]) {
					mainchannel = message.guild.channels.cache.find(c => c.name == channels[i][1]);
					if (mainchannel == undefined) {
						console.log(channels[i][0]);
						console.log(channels[i][1]);
						return;
					}
					if (channels[i][3] == undefined) {
						mainchannel.send(pokembed);
						mainchannel.send('A shiny was hatched in ' + message.channel.name + '!');
						return;
					} else {
						mainchannel.send(pokembed);
						mainchannel.send(channels[i][3] + ' A shiny was hatched in ' + message.channel.name + '!');
						return;
					}
				} 
			}
		} //embed includes hatched an egg and the embed includes shiny

		if ((pokemon.includes('hatched an Egg!","icon"')) && (eggexcl.some(e => pokemon.includes(e)))) {
			message.pin({ reason: 'Exclusive hatched!' });
			pokembed.description = pokembed.description.replace(/<.*?>/g, ' ');
			pokembed.addField('​​\u200b','This Pokémon was hatched in: ' + `[${message.channel.name}](${message.url})`);
			for (let i = 0; i < channels.length; i++) {
				if (message.guild.name == channels[i][0]) {
					mainchannel = message.guild.channels.cache.find(c => c.name == channels[i][1]);
					if (mainchannel == undefined) {
						console.log(channels[i][0]);
						console.log(channels[i][1]);
						return;
					}
					mainchannel.send(pokembed);
					mainchannel.send('An exclusive was hatched in ' + message.channel.name + '!');
					return;
				} 
			}	
		} //embed includes hatched an egg and embed includes an egg exlusive name

		if ((pokemon.includes('hatched an Egg!","icon"')) && (legends.some(e => pokemon.includes(e)))) {
			message.pin({ reason: 'Legendary hatched!' });
			pokembed.description = pokembed.description.replace(/<.*?>/g, ' ');
			pokembed.addField('​​\u200b','This Pokémon was hatched in: ' + `[${message.channel.name}](${message.url})`);
			for (let i = 0; i < channels.length; i++) {
				if (message.guild.name == channels[i][0]) {
					mainchannel = message.guild.channels.cache.find(c => c.name == channels[i][1]);
					if (mainchannel == undefined) {
						console.log(channels[i][0]);
						console.log(channels[i][1]);
						return;
					}
					if (channels[i][2] == undefined) {
						mainchannel.send(pokembed);
						mainchannel.send('A legendary was hatched in ' + message.channel.name + '!');
						return;
					} else {
						mainchannel.send(pokembed);
						mainchannel.send(channels[i][2] + ' A legendary was hatched in ' + message.channel.name + '!');
						return;
					}
				} 
			}
		} //embed includes hatched an egg and embed includes a legendary name

		if ((pokemon.includes('from a swap!","url":null')) && (pokemon.includes('shiny'))) {
			message.pin({ reason: 'Shiny swapped!' });
			pokembed.description = pokembed.description.replace(/<.*?>/g, ' ');
			pokembed.addField('​​\u200b','This Pokémon was swapped in: ' + `[${message.channel.name}](${message.url})`);
			for (let i = 0; i < channels.length; i++) {
				if (message.guild.name == channels[i][0]) {
					mainchannel = message.guild.channels.cache.find(c => c.name == channels[i][1]);
					if (mainchannel == undefined) {
						console.log(channels[i][0]);
						console.log(channels[i][1]);
						return;
					}
					if (channels[i][3] == undefined) {
						mainchannel.send(pokembed);
						mainchannel.send('A shiny was swapped in ' + message.channel.name + '!');
						return;
					} else {
						mainchannel.send(pokembed);
						mainchannel.send(channels[i][3] + ' A shiny was swapped in ' + message.channel.name + '!');
						return;
					}
				} 
			}
		} //embed includes from a swap and embed includes shiny

		if ((pokemon.includes('from a swap!","url":null')) && (pokemon.includes('golden'))) {
			message.pin({ reason: 'Golden swapped!' });
			pokembed.description = pokembed.description.replace(/<.*?>/g, ' ');
			pokembed.addField('​​\u200b','This Pokémon was swapped in: ' + `[${message.channel.name}](${message.url})`);
			for (let i = 0; i < channels.length; i++) {
				if (message.guild.name == channels[i][0]) {
					mainchannel = message.guild.channels.cache.find(c => c.name == channels[i][1]);
					if (mainchannel == undefined) {
						console.log(channels[i][0]);
						console.log(channels[i][1]);
						return;
					}
					if (channels[i][3] == undefined) {
						mainchannel.send(pokembed);
						mainchannel.send('A golden was swapped in ' + message.channel.name + '!');
						return;
					} else {
						mainchannel.send(pokembed);
						mainchannel.send(channels[i][3] + ' A golden was swapped in ' + message.channel.name + '!');
						return;
					}
				} 
			}
		} //embed includes from a swap and embed includes golden

		if ((pokemon.includes('from a swap!","url":null')) && (legends.some(e => pokemon.includes(e)))) {
			message.pin({ reason: 'Legendary swapped!' });
			pokembed.description = pokembed.description.replace(/<.*?>/g, ' ');
			pokembed.addField('​​\u200b','This Pokémon was swapped in: ' + `[${message.channel.name}](${message.url})`);
			for (let i = 0; i < channels.length; i++) {
				if (message.guild.name == channels[i][0]) {
					mainchannel = message.guild.channels.cache.find(c => c.name == channels[i][1]);
					if (mainchannel == undefined) {
						console.log(channels[i][0]);
						console.log(channels[i][1]);
						return;
					}
					if (channels[i][2] == undefined) {
						mainchannel.send(pokembed);
						mainchannel.send('A legendary was swapped in ' + message.channel.name + '!');
						return;
					} else {
						mainchannel.send(pokembed);
						mainchannel.send(channels[i][2] + ' A legendary was swapped in ' + message.channel.name + '!');
						return;
					}
				} 
			}
		} //embed includes from a swap and embed has a legendary name

		if ((pokemon.includes('<:Legendary:667123969245184022>')) && (pokemon.includes('catchbot returned with')))  {
			message.pin({ reason: 'Legendary catchbot!' });
			pokembed.description = pokembed.description.replace(/<.*?>/g, ' ');
			pokembed.addField('​​\u200b','This Pokémon was CBed in: ' + `[${message.channel.name}](${message.url})`);
			for (let i = 0; i < channels.length; i++) {
				if (message.guild.name == channels[i][0]) {
					mainchannel = message.guild.channels.cache.find(c => c.name == channels[i][1]);
					if (mainchannel == undefined) {
						console.log(channels[i][0]);
						console.log(channels[i][1]);
						return;
					}
					if (channels[i][2] == undefined) {
						mainchannel.send(pokembed);
						mainchannel.send('A legendary was CBed in ' + message.channel.name + '!');
						return;
					} else {
						mainchannel.send(pokembed);
						mainchannel.send(channels[i][2] + ' A legendary was CBed in ' + message.channel.name + '!');
						return;
					}
				} 
			}
		} //embed includes legendary emote and catchbot returned with

		if ((pokemon.includes('<:Shiny:667126233217105931>')) && (pokemon.includes('catchbot returned with')))  {
			message.pin({ reason: 'Shiny catchbot!' });
			pokembed.description = pokembed.description.replace(/<.*?>/g, ' ');
			pokembed.addField('​​\u200b','This Pokémon was CBed in: ' + `[${message.channel.name}](${message.url})`);
			for (let i = 0; i < channels.length; i++) {
				if (message.guild.name == channels[i][0]) {
					mainchannel = message.guild.channels.cache.find(c => c.name == channels[i][1]);
					if (mainchannel == undefined) {
						console.log(channels[i][0]);
						console.log(channels[i][1]);
						return;
					}
					if (channels[i][3] == undefined) {
						mainchannel.send(pokembed);
						mainchannel.send('A shiny was CBed in ' + message.channel.name + '!');
						return;
					} else {
						mainchannel.send(pokembed);
						mainchannel.send(channels[i][3] + ' A shiny was CBed in ' + message.channel.name + '!');
						return;
					}
				} 
			}
		} //embed includes shiny emote and catchbot returned with
	} 
});

client.on('messageUpdate', (oldMessage, newMessage) => {
	if (oldMessage.author.id != '664508672713424926') {return;}
    if ((oldMessage.embeds[0].author.name == newMessage.embeds[0].author.name) || (!(newMessage.embeds[0].author.name.includes('wild')))) {
		return;
	}

	var pokembed = newMessage.embeds[0];
	var pokemon = JSON.stringify(pokembed);	

	if ((pokemon.includes('shiny')) && (pokemon.includes('fished'))) {
		newMessage.pin({ reason: 'Shiny fished!' });
		pokembed.description = pokembed.description.replace(/<.*?>/g, ' ');
		pokembed.addField('​​\u200b','This Pokémon was fished in: ' + `[${newMessage.channel.name}](${newMessage.url})`);
		for (let i = 0; i < channels.length; i++) {
			if (newMessage.guild.name == channels[i][0]) {
				if (mainchannel == undefined) {
					console.log(channels[i][0]);
					console.log(channels[i][1]);
					return;
				}
				mainchannel = newMessage.guild.channels.cache.find(c => c.name == channels[i][1]);
				if (channels[i][3] == undefined) {
					mainchannel.send(pokembed);
					mainchannel.send('A shiny was fished in ' + newMessage.channel.name + '!');
					return;
				} else {
					mainchannel.send(pokembed);
					mainchannel.send(channels[i][3] + ' A shiny was fished in ' + newMessage.channel.name + '!');
					return;
				}
			} 
		}
	} //embed includes shiny and embed includes fished

	if ((pokemon.includes('golden')) && (pokemon.includes('fished'))) {
		newMessage.pin({ reason: 'Golden fished!' });
		pokembed.description = pokembed.description.replace(/<.*?>/g, ' ');
		pokembed.addField('​​\u200b','This Pokémon was fished in: ' + `[${newMessage.channel.name}](${newMessage.url})`);
		for (let i = 0; i < channels.length; i++) {
			if (newMessage.guild.name == channels[i][0]) {
				mainchannel = newMessage.guild.channels.cache.find(c => c.name == channels[i][1]);
				if (mainchannel == undefined) {
					console.log(channels[i][0]);
					console.log(channels[i][1]);
					return;
				}
				if (channels[i][3] == undefined) {
					mainchannel.send(pokembed);
					mainchannel.send('A golden was fished in ' + newMessage.channel.name + '!');
					return;
				} else {
					mainchannel.send(pokembed);
					mainchannel.send(channels[i][3] + ' A golden was fished in ' + newMessage.channel.name + '!');
					return;
				}
			} 
		}
	} //embed includes golden and embed includes fished

	if ((legends.some(e => pokemon.includes(e))) && (pokemon.includes('fished'))) {
		newMessage.pin({ reason: 'Legendary fished!' });
		pokembed.description = pokembed.description.replace(/<.*?>/g, ' ');
		pokembed.addField('​​\u200b','This Pokémon was fished in: ' + `[${newMessage.channel.name}](${newMessage.url})`);
		for (let i = 0; i < channels.length; i++) {
			if (newMessage.guild.name == channels[i][0]) {
				mainchannel = newMessage.guild.channels.cache.find(c => c.name == channels[i][1]);
				if (mainchannel == undefined) {
					console.log(channels[i][0]);
					console.log(channels[i][1]);
					return;
				}
				if (channels[i][2] == undefined) {
					mainchannel.send(pokembed);
					mainchannel.send('A legendary was fished in ' + newMessage.channel.name + '!');
					return;
				} else {
					mainchannel.send(pokembed);
					mainchannel.send(channels[i][2] + ' A legendary was fished in ' + newMessage.channel.name + '!');
					return;
				}
			} 
		}
	} //embed includes a legendary name and embed includes fished
}); 
