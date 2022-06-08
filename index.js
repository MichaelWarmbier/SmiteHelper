// Libraries
const { Client, Intents, MessageEmbed, MessageActionRow, MessageSelectMenu } = require("discord.js");
const fs = require('fs');

// Local JSON Files
var jsonGodData = require('./JSON/gods.json'); 
var jsonItemData = require('./JSON/items.json'); 
var prefixStore = require('./JSON/PrefixStore.json');

/*///// Data /////*/
let prefix = null;
const defaultPrefix = '?';
const date = new Date();

const colors = { // ANSI Colors
  Err: '\u001b[31m',
  Msg: '\u001b[36m',
  Str: '\u001b[33m',
  Date:'\u001b[34m',
  Name:'\u001b[32m',
  End: '\u001b[37m'
}

const SmiteStatsLogo = 'https://github.com/MichaelWarmbier/michaelwarmbier.github.io/blob/master/Smite-Stats/assets/site/bolt.png?raw=true';
const visitMessage = 'Make custom builds with SmiteStats -- SmiteBuildMaker.com\nInformation retrieve through the Smite API.';

var currentGodEmbed = new MessageEmbed().setColor('#B5A672').setFooter({ text: visitMessage, iconURL: SmiteStatsLogo });
var currentItemEmbed = new MessageEmbed().setColor('#B5A672').setFooter({ text: visitMessage, iconURL: SmiteStatsLogo });;

/*///// Client Initialization /////*/

const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES]
});
client.on("ready", () => {
  console.log("Bot online.");
});

/*///// Utility Functions /////*/

function findGod(name) {  
  let i;
  for (i = 0; i < jsonGodData.length; i++)
  if ((jsonGodData[i].Name.toLowerCase()).replace(/ /g, '') == (name.toLowerCase()).replace(/ /g, ''))
    return [true, i];
  return [false, null];
}

function findItem(name) {
  let i;
  for (i = 0; i < jsonItemData.length; i++)
  if ((jsonItemData[i].DeviceName.toLowerCase()).replace(/ /g, '') == (name.toLowerCase()).replace(/ /g, ''))
    return [true, i];
  return [false, null];
}

function getGodById(id) {
  return jsonGodData[id];
}

function getItemById(id) {
  return jsonItemData[id];
}

function createEmbedGod(jsonData) {
  let temp = null;
  currentGodEmbed
  .setTitle(String(jsonData.Name))
  .setURL(`https://michaelwarmbier.github.io/Smite-Stats/?Lg=${jsonData.id}&Ll=20&Li0=N&Li1=N&Li2=N&Li3=N&Li4=N&Li5=N&Lb=none&Lfb=none&Rg=N&Rl=1&Ri0=N&Ri1=N&Ri2=N&Ri3=N&Ri4=N&Ri5=N&Rb=none&Rfb=none`)
	.setDescription(jsonData.Title)
  .addField('Role', jsonData.Roles, true)
  .addField('Type', jsonData.Type, true)
	.setThumbnail(jsonData.godIcon_URL)
	.setTimestamp()

  temp = jsonData.Ability_5.Description.itemDescription;
  let currentGodEmbedPassive = new MessageEmbed()
  .setColor('#B5A672')
	.setTitle(`[PASSIVE] ${jsonData.Ability_5.Summary}`)
	.setDescription(temp.description)
	.setThumbnail(jsonData.Ability_5.URL)
   for (i = 0; i < temp.rankitems.length; i++)
    currentGodEmbedPassive.addField(temp.rankitems[i].description, temp.rankitems[i].value, true);
  
  temp = jsonData.Ability_1.Description.itemDescription;
  let currentGodEmbedAbility1 = new MessageEmbed()
  .setColor('#B5A672')
  .setTitle(jsonData.Ability_1.Summary)
	.setDescription(temp.description)
	.setThumbnail(jsonData.Ability_1.URL)
   for (i = 0; i < temp.rankitems.length; i++)
    currentGodEmbedAbility1.addField(temp.rankitems[i].description, temp.rankitems[i].value, true);
  currentGodEmbedAbility1.addField('Mana Cost', temp.cost, true);
  currentGodEmbedAbility1.addField('Cooldown', temp.cooldown, true);

  temp = jsonData.Ability_2.Description.itemDescription;
  let currentGodEmbedAbility2 = new MessageEmbed()
  .setColor('#B5A672')
  .setTitle(jsonData.Ability_2.Summary)
	.setDescription(temp.description)
	.setThumbnail(jsonData.Ability_2.URL)
   for (i = 0; i < temp.rankitems.length; i++)
    currentGodEmbedAbility2.addField(temp.rankitems[i].description, temp.rankitems[i].value, true);
  currentGodEmbedAbility2.addField('Mana Cost', temp.cost, true);
  currentGodEmbedAbility2.addField('Cooldown', temp.cooldown, true);

  temp = jsonData.Ability_3.Description.itemDescription;
  let currentGodEmbedAbility3 = new MessageEmbed()
  .setColor('#B5A672')
  .setTitle(jsonData.Ability_3.Summary)
	.setDescription(temp.description)
	.setThumbnail(jsonData.Ability_3.URL)
   for (i = 0; i < temp.rankitems.length; i++)
    currentGodEmbedAbility3.addField(temp.rankitems[i].description, temp.rankitems[i].value, true);
  currentGodEmbedAbility3.addField('Mana Cost', temp.cost, true);
  currentGodEmbedAbility3.addField('Cooldown', temp.cooldown, true);

  temp = jsonData.Ability_4.Description.itemDescription;
  let currentGodEmbedAbility4 = new MessageEmbed()
  .setColor('#B5A672')
  .setTitle(jsonData.Ability_4.Summary)
	.setDescription(temp.description)
  .setThumbnail(jsonData.Ability_4.URL)
   for (i = 0; i < temp.rankitems.length; i++)
    currentGodEmbedAbility4.addField(temp.rankitems[i].description, temp.rankitems[i].value, true);
  currentGodEmbedAbility4.addField('Mana Cost', temp.cost, true);
  currentGodEmbedAbility4.addField('Cooldown', temp.cooldown, true);

  return [currentGodEmbed, currentGodEmbedPassive, currentGodEmbedAbility1, currentGodEmbedAbility2, currentGodEmbedAbility3, currentGodEmbedAbility4, currentGodEmbedPassive];
}

function createEmbedItem(jsonData) {
  currentItemEmbed = new MessageEmbed();
  currentItemEmbed
	.setTitle(jsonData.DeviceName)
	.setDescription(jsonData.ItemDescription.SecondaryDescription)
	.setThumbnail(jsonData.itemIcon_URL)
	.setTimestamp()
  let i;
  for (i = 0; i < jsonData.ItemDescription.Menuitems.length; i++) {
    currentItemEmbed.addField(jsonData.ItemDescription.Menuitems[i].Description, jsonData.ItemDescription.Menuitems[i].Value, true)
  }
  return currentItemEmbed;
}

/*///// Message Handling /////*/
client.on("messageCreate", (message) => {
  
  try {

    if (Object.keys(prefixStore).includes(message.guild.id))
      prefix = prefixStore[message.guild.id];
    else prefix = defaultPrefix;
    
    let timeStamp = 
      (date.getUTCMonth() + 1) + '/' + date.getUTCDate() + '/' + date.getUTCFullYear();

    if(message.author.bot || !message.content.startsWith(prefix)) return;
    ////////////////////////////
    console.log(`${colors.Msg}Message sent from ${colors.Name}'${message.author.username}' ${colors.Msg}at ${timeStamp}:${colors.Str} "${message}" ${colors.End}`);
    ////////////////////////////
    if (message.content.startsWith(`${prefix}ping`))
      message.channel.send("SmiteStats Bot.\nCreate by Michael Warmbier.\nPing successful.");
    ////////////////////////////
    if (message.content.startsWith(`${prefix}god `)) {
      args = message.content.split(`${prefix}god `);
      let [result, id] = findGod(args[1]);
      if (result) {
        let embed = createEmbedGod(getGodById(id));
        message.channel.send({ embeds: [embed[0], embed[1], embed[2], embed[3], embed[4], embed[5]] });
      }
    }
    ////////////////////////////
    if (message.content.startsWith(`${prefix}item `)) {
      args = message.content.split(`${prefix}item `);
      let [result, id] = findItem(args[1]);
      if (result) {
        let embed = createEmbedItem(getItemById(id));
        message.channel.send({ embeds: [embed] });
      }
    }
    ////////////////////////////
    if (message.content.startsWith(`${prefix}prefix `)) {
      if (message.member.permissions.has('MANAGE_GUILD')) {
        args = message.content.split(`${prefix}prefix `);
        if (args[1].length == 1) {
          let newPrefix = args[1];
          let guild = message.guild.id;
          prefixStore[guild] = newPrefix;
          prefixStore = JSON.stringify(prefixStore, null, 4);
          fs.writeFile('./JSON/PrefixStore.json', prefixStore, err =>
            { if (err) throw err; });
        }
        else {
          message.channel.send('Prefix must be limited to one character.');
        }
      }
      else {
        message.channel.send('User is not the server owner.');
        return;
      }
    }
    
  }
  catch(err) { console.log(`Error: ${err} `)}
});

/*///// Interaction Handling /////*/
client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	if (interaction.commandName === 'ping') {
		const row = new MessageActionRow()
			.addComponents(
				new MessageSelectMenu()
					.setCustomId('select')
					.setPlaceholder('Nothing selected')
					.addOptions([
						{
							label: 'Select me',
							description: 'This is a description',
							value: 'first_option',
						},
						{
							label: 'You can select me too',
							description: 'This is also a description',
							value: 'second_option',
						},
					]),
			);
    console.log('Interaction')
		await interaction.reply({ content: 'Pong!', components: [row] });
	}
});

/*///// Login to Bot /////*/
client.login(process.env['API_Key']);
