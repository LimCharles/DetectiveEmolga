require('dotenv').config()
const Discord = require('discord.js');
const client = new Discord.Client();
client.login(process.env.DISCORD_TOKEN);

const MongoClient = require('mongodb').MongoClient;
const uri = process.env.MONGO_URL;
const mongo = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true});

var channels = new Map();

mongo.connect( async () => {
    var collection = mongo.db("ServerData").collection("SavedChannels");
	var dd = await collection.find().toArray();
    for (let i = 0; i < dd.length; i++ ) {
        channels.set(dd[i].ServerName, {ChannelName:dd[i].ChannelName,LegendaryRole:dd[i].LegendaryRole,ShinyRole:dd[i].ShinyRole});
	}
	setInterval( async () => {
		function mapToObj(inputMap) {
			let array = [];
			
			inputMap.forEach((value, key) => {
				array.push({
				ServerName: key,
				ChannelName: value.ChannelName,
				LegendaryRole: value.LegendaryRole,
				ShinyRole: value.ShinyRole
				});
			});
		
			return array;
		}
	
		await collection.deleteMany(({}));
		await collection.insertMany(mapToObj(channels));
		console.log('Updated collection!');
	}, 3600000);
});

client.on('message', (message) => {
	const eggexcl = [
		'/chingling.',
		'/bonsly.',
		'/mimejr.',
		'/happiny.',
		'/chatot.',
		'/munchlax.',
		'/riolu.',
		'/mantyke.',
		'/audino.',
		'/zorua.',
		'/emolga.',
		'/ferroseed.',
		'/golett.',
		'/pawniard.',
		'/larvesta.',
		'/pancham.',
		'/spritzee.',
		'/swirlix.',
		'/skrelp.',
		'/noibat.',
		'/rockruff.',
		'/mareanie.',
		'/wimpod.',
		'/carbink.',
		'/mimikyu.'
	];
	
	const legends = [
		'/articuno.',
		'/zapdos.',
		'/moltres.',
		'/raikou.',
		'/entei.',
		'/suicune.',
		'/regirock.',
		'/regice.',
		'/registeel.',
		'/latias.',
		'/latios.',
		'/uxie.',
		'/mesprit.',
		'/azelf.',
		'/heatran.',
		'/regigigas.',
		'/cresselia.',
		'/cobalion.',
		'/terrakion.',
		'/virizion.',
		'/tornadus.',
		'/thundurus.',
		'/landorus.',
		'/typenull.',
		'/silvally.',
		'/tapukoko.',
		'/tapulele.',
		'/tapubulu.',
		'/tapufini.',
		'/nihilego.',
		'/buzzwole.',
		'/pheromosa.',
		'/xurkitree.',
		'/celesteela.',
		'/kartana.',
		'/guzzlord.',
		'/poipole.',
		'/naganadel.',
		'/stakataka.',
		'/blacephalon.',
		'/kubfu.',
		'/urshifu.',
		'/regieleki.',
		'/regidrago.',
		'/glastrier.',
		'/spectrier.',
		'/mewtwo.',
		'/lugia.',
		'/hooh.',
		'/kyogre.',
		'/groudon.',
		'/rayquaza.',
		'/dialga.',
		'/palkia.',
		'/giratina.',
		'/reshiram.',
		'/zekrom.',
		'/kyurem.',
		'/xerneas.',
		'/yveltal.',
		'/zygarde.',
		'/cosmog.',
		'/cosmoem.',
		'/solgaleo.',
		'/lunala.',
		'/necrozma.',
		'/zacian.',
		'/zamazenta.',
		'/eternatus.',
		'/calyrex.',
		'/mew.',
		'/celebi.',
		'/jirachi.',
		'/deoxys.',
		'/phione.',
		'/manaphy.',
		'/darkrai.',
		'/shaymin.',
		'/arceus.',
		'/victini.',
		'/keldeo.',
		'/meloetta.',
		'/genesect.',
		'/diancie.',
		'/hoopa.',
		'/volcanion.',
		'/magearna.',
		'/marshadow.',
		'/zeraora.',
		'/meltan.',
		'/melmetal.',
		'/zarude.'
	];

	if (channels.length == 0)
	if (message.guild.name == null) { return; }
	var mainserver = channels.get(message.guild.name);

	var perms = [
		'VIEW_CHANNEL',
		'SEND_MESSAGES',
		'EMBED_LINKS',
		'READ_MESSAGE_HISTORY',
		'MENTION_EVERYONE',
	]

	if (!perms.every(e => message.guild.me.permissions.toArray().includes(e))) {
		try {
			message.channel.send("I don't have permissions! Please re-invite me with this link: https://discord.com/api/oauth2/authorize?client_id=778585732318756874&permissions=216064&scope=bot");
		} catch {
			console.log(message.guild.name);
		}
		return;
	}

	if (message.content == '!channel') {
		if (mainserver == undefined) {
			channels.set(message.guild.name, {ChannelName:message.channel.name,LegendaryRole:null,ShinyRole:null});
			message.channel.send('This is now the rare-drops channel!');
			return;
		} else {
			channels.get(message.guild.name).ChannelName = message.channel.name;
			message.channel.send('This is now the rare-drops channel!');
			return;
		}
	} //check if guild name exists, if not, add it to channels. If it does exist, change channel name

	if (message.content.startsWith('!mention')) {
		let args = message.content.trim().split(' ');
		switch (args[1]) {
			case 'al':
				mainserver.LegendaryRole = args[2];
				message.channel.send(`${mainserver.LegendaryRole} will now be tagged for legendary catches!`);
				return;
		
			case 'as':
				mainserver.ShinyRole = args[2];
				message.channel.send(`${mainserver.ShinyRole} will now be tagged for shiny catches!`);
				return;

			case 'rl':
				mainserver.LegendaryRole = null;
				message.channel.send('Legendary role removed!');
				return;

			case 'rs':
				mainserver.Shinyole = null;
				message.channel.send('Shiny role removed!');
				return;

			case 'check':
				message.channel.send(`${mainserver.LegendaryRole == null ? 'There is no legendary role!' : `${mainserver.LegendaryRole} is the role for legendary catches!`} 
${mainserver.ShinyRole == null ? 'There is no shiny role!' : `${mainserver.LegendaryRole} is the role for shiny catches!`}`);
				return; //template literal needs more support, can't indent without actually adding indent
			default:
				message.channel.send('Wrong format!');
				return;
		}
	}

	if (message.author.id != '664508672713424926') { return; } //return if not sent by PokeMeow


	if (mainserver != undefined) { 
		var mainchannel = message.guild.channels.cache.find(c => c.name == mainserver.ChannelName);
		if (mainchannel == undefined) {
			message.channel.send("I can't find your rare-spawns channel! Did you change the name? Please use !channel again!")
			return; 
		}
	} else {
		message.channel.send("You haven't set a rare-drops channel! Please use !channel in your rare drops channel!");
		return;
	}   //check if guild name exists and if it doesn't, check if channel name exists in guild

	var pokembed = message.embeds[0];
	var poketext = JSON.stringify(pokembed);
	
	function formatembed(pokembed) {
		if (pokembed.description != null) {
			pokembed.description = pokembed.description.replace(/<.*?>/g, ' ');
		}
		pokembed.addField('​​\u200b','Link to Original Message: ' + `[${message.channel.name}](${message.url})`);
		pokembed.footer = "";
		return pokembed;
	}

	function checklegendaryrole() {
		let legendaryrole = mainserver.LegendaryRole;
		if (legendaryrole == null) {
			return "";
		} else {
			return legendaryrole;
		}
	}	

	function checkshinyrole() {
		let shinyrole = mainserver.ShinyRole;
		if (shinyrole == null) {
			return "";
		} else {
			return shinyrole;
		}
	}	

	if (pokembed != undefined) {
		if (poketext.includes('"footer":{"text":"Legendary (')) {
			mainchannel.send(formatembed(pokembed));
			mainchannel.send(`${checklegendaryrole()} A legendary was found in ${message.channel.name}!`)
		} //normal legendary spawn

		if (poketext.includes('"footer":{"text":"Shiny (')) {
			mainchannel.send(formatembed(pokembed));
			mainchannel.send(`${checkshinyrole()} A shiny was found in ${message.channel.name}!`)
		} //normal shiny spawn

		if ((poketext.includes('hatched an Egg!')) && (poketext.includes('ani-shiny'))) {
			mainchannel.send(formatembed(pokembed));
			mainchannel.send(`${checkshinyrole()} A shiny was hatched in ${message.channel.name}!`);
		} //embed includes hatched an egg and the embed includes ani-shiny

		if ((poketext.includes('hatched an Egg!')) && (eggexcl.some(e => poketext.includes(e)))) {
			mainchannel.send(formatembed(pokembed));
			mainchannel.send(`An exclusive was hatched in ${message.channel.name}!`);
		} //embed includes hatched an egg and embed includes an egg exlusive name

		if ((poketext.includes('hatched an Egg!')) && (legends.some(e => poketext.includes(e)))) {
			mainchannel.send(formatembed(pokembed));
			mainchannel.send(`${checklegendaryrole()} A legendary was hatched in ${message.channel.name}!`)
		} //embed includes hatched an egg and embed includes a legendary name

		if ((poketext.includes('from a swap!","url":null')) && (poketext.includes('ani-shiny'))) {
			mainchannel.send(formatembed(pokembed));
			mainchannel.send(`${checkshinyrole()} A shiny was swapped in ${message.channel.name}!`);
		} //embed includes from a swap and embed includes ani-shiny

		if ((poketext.includes('from a swap!","url":null')) && (poketext.includes('/golden'))) {
			mainchannel.send(formatembed(pokembed));
			mainchannel.send(`${checkshinyrole()} A golden was swapped in ${message.channel.name}!`);
		} //embed includes from a swap and embed includes /golden

		if ((poketext.includes('from a swap!","url":null')) && (legends.some(e => poketext.includes(e)))) {
			mainchannel.send(formatembed(pokembed));
			mainchannel.send(`${checklegendaryrole()} A legendary was swapped in ${message.channel.name}!`)
		} //embed includes from a swap and embed has a legendary name

		if ((poketext.includes('<:Legendary:667123969245184022>')) && (poketext.includes('catchbot returned with')))  {
			mainchannel.send(formatembed(pokembed));
			mainchannel.send(`${checklegendaryrole()} A legendary was CBed in ${message.channel.name}!`)
		} //embed includes legendary emote and catchbot returned with

		if ((poketext.includes('<:Shiny:667126233217105931>')) && (poketext.includes('catchbot returned with')))  {
			mainchannel.send(formatembed(pokembed));
			mainchannel.send(`${checkshinyrole()} A shiny was CBed in ${message.channel.name}!`);
		} //embed includes shiny emote and catchbot returned with

		if ((poketext.includes('Type ;vote to get more boxes!')) && (poketext.includes('ani-shiny')))  {
			mainchannel.send(formatembed(pokembed));
			mainchannel.send(`${checkshinyrole()} A shiny was unboxed in ${message.channel.name}!`);
		} //embed includes vote message and ani-shiny

		if ((poketext.includes('Type ;vote to get more boxes!')) && (legends.some(e => poketext.includes(e)))) {
			mainchannel.send(formatembed(pokembed));
			mainchannel.send(`${checklegendaryrole()} A legendary was unboxed in ${message.channel.name}!`)
		} //embed includes vote message and embed has a legendary name
	}
});

client.on('messageUpdate', (oldMessage, newMessage) => {
	if (oldMessage.author.id != '664508672713424926') {return;}
	if (oldMessage == undefined) {return;}
	if (oldMessage.embeds[0] == undefined) {return;}
	if (oldMessage.embeds[0].author == undefined) {return;}
	if (oldMessage.embeds[0].author.name == undefined) {return;}
	if (newMessage == undefined ) {return;}
	if (newMessage.embeds[0] == undefined) {return;}
	if (newMessage.embeds[0].author == undefined) {return;}
	if (newMessage.embeds[0].author.name == undefined) {return;}
    if ((oldMessage.embeds[0].author.name == newMessage.embeds[0].author.name) || (!(newMessage.embeds[0].author.name.includes('wild')))) { return; }

	var pokembed = newMessage.embeds[0];
	var poketext = JSON.stringify(pokembed);	

	const legends = [
		'/articuno.',
		'/zapdos.',
		'/moltres.',
		'/raikou.',
		'/entei.',
		'/suicune.',
		'/regirock.',
		'/regice.',
		'/registeel.',
		'/latias.',
		'/latios.',
		'/uxie.',
		'/mesprit.',
		'/azelf.',
		'/heatran.',
		'/regigigas.',
		'/cresselia.',
		'/cobalion.',
		'/terrakion.',
		'/virizion.',
		'/tornadus.',
		'/thundurus.',
		'/landorus.',
		'/typenull.',
		'/silvally.',
		'/tapukoko.',
		'/tapulele.',
		'/tapubulu.',
		'/tapufini.',
		'/nihilego.',
		'/buzzwole.',
		'/pheromosa.',
		'/xurkitree.',
		'/celesteela.',
		'/kartana.',
		'/guzzlord.',
		'/poipole.',
		'/naganadel.',
		'/stakataka.',
		'/blacephalon.',
		'/kubfu.',
		'/urshifu.',
		'/regieleki.',
		'/regidrago.',
		'/glastrier.',
		'/spectrier.',
		'/mewtwo.',
		'/lugia.',
		'/hooh.',
		'/kyogre.',
		'/groudon.',
		'/rayquaza.',
		'/dialga.',
		'/palkia.',
		'/giratina.',
		'/reshiram.',
		'/zekrom.',
		'/kyurem.',
		'/xerneas.',
		'/yveltal.',
		'/zygarde.',
		'/cosmog.',
		'/cosmoem.',
		'/solgaleo.',
		'/lunala.',
		'/necrozma.',
		'/zacian.',
		'/zamazenta.',
		'/eternatus.',
		'/calyrex.',
		'/mew.',
		'/celebi.',
		'/jirachi.',
		'/deoxys.',
		'/phione.',
		'/manaphy.',
		'/darkrai.',
		'/shaymin.',
		'/arceus.',
		'/victini.',
		'/keldeo.',
		'/meloetta.',
		'/genesect.',
		'/diancie.',
		'/hoopa.',
		'/volcanion.',
		'/magearna.',
		'/marshadow.',
		'/zeraora.',
		'/meltan.',
		'/melmetal.',
		'/zarude.'
	];

	if (newMessage.guild.name == null) { return; }
	var mainserver = channels.get(newMessage.guild.name);

	if (mainserver != undefined) { 
		var mainchannel = newMessage.guild.channels.cache.find(c => c.name == mainserver.ChannelName);
		if (mainchannel == undefined) {
			message.channel.send("I can't find your rare-spawns channel! Did you change the name? Please use !channel again!")
			return; 
		}
	} else {
		message.channel.send("You haven't set a rare-drops channel! Please use !channel in your rare drops channel!");
		return;
	}   //check if guild name exists and if it doesn't, check if channel name exists in guild

	function formatembed(pokembed) {
		pokembed.description = pokembed.description.replace(/<.*?>/g, ' ');
		pokembed.addField('​​\u200b','Link to Original Message: ' + `[${newMessage.channel.name}](${newMessage.url})`);
		pokembed.footer = "";
		return pokembed;
	}

	function checklegendaryrole() {
		let legendaryrole = mainserver.LegendaryRole;
		if (legendaryrole == null) {
			return "";
		} else {
			return legendaryrole;
		}
	}	

	function checkshinyrole() {
		let shinyrole = mainserver.ShinyRole;
		if (shinyrole == null) {
			return "";
		} else {
			return shinyrole;
		}
	}

	if ((poketext.includes('ani-shiny')) && (poketext.includes('fished'))) {
		mainchannel.send(formatembed(pokembed));
		mainchannel.send(`${checkshinyrole()} A shiny was fished in ${newMessage.channel.name}!`);
	} //embed includes ani-shiny and embed includes fished

	if ((poketext.includes('/golden')) && (poketext.includes('fished'))) {
		mainchannel.send(formatembed(pokembed));
		mainchannel.send(`${checkshinyrole()} A golden was fished in ${newMessage.channel.name}!`);
	} //embed includes /golden and embed includes fished

	if ((legends.some(e => poketext.includes(e))) && (poketext.includes('fished'))) {
		mainchannel.send(formatembed(pokembed));
		mainchannel.send(`${checklegendaryrole()} A legendary was fished in ${newMessage.channel.name}!`)
	} //embed includes a legendary name and embed includes fished
}); 

