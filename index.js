// discord.js library
const { Client, Intents, MessageEmbed } = require("discord.js");
var jsonGodData = require('./JSON/gods.json'); 
var jsonItemData = require('./JSON/items.json'); 

/*///// Data /////*/
var prefix = '?';
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
  if (jsonGodData[i].Name.toLowerCase() == name.toLowerCase())
    return [true, i];
  return [false, null];
}

function findItem(name) {
  let i;
  for (i = 0; i < jsonItemData.length; i++)
  if (jsonItemData[i].DeviceName.toLowerCase() == name.toLowerCase())
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
  currentGodEmbed
	.setTitle(jsonData.Name)
  .setURL(`https://michaelwarmbier.github.io/Smite-Stats/?Lg=${jsonData.id}&Ll=20&Li0=N&Li1=N&Li2=N&Li3=N&Li4=N&Li5=N&Lb=none&Lfb=none&Rg=N&Rl=1&Ri0=N&Ri1=N&Ri2=N&Ri3=N&Ri4=N&Ri5=N&Rb=none&Rfb=none`)
	.setDescription('Temp Description')
	.setThumbnail(jsonData.godIcon_URL)
	.setTimestamp()
  return currentGodEmbed;
}

function createEmbedItem(jsonData) {
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

  let timeStamp = 
    (date.getUTCMonth() + 1) + '/' + date.getUTCDate() + '/' + date.getUTCFullYear();

  if(message.author.bot || !message.content.startsWith(prefix)) return;

  console.log(`${colors.Msg}Message sent from ${colors.Name}'${message.author.username}' ${colors.Msg}at ${timeStamp}:${colors.Str} "${message}" ${colors.End}`);
  
  if (message.content.startsWith(`${prefix}ping`))
    message.channel.send("SmiteStats Bot.\nCreate by Michael Warmbier.\nPing successful.");

  if (message.content.startsWith(`${prefix}god `)) {
    args = message.content.split(`${prefix}god `);
    let [result, id] = findGod(args[1]);
    if (result) {
      let embed = createEmbedGod(getGodById(id));
      message.channel.send({ embeds: [embed] });
    }
  }

  if (message.content.startsWith(`${prefix}item `)) {
    args = message.content.split(`${prefix}item `);
    let [result, id] = findItem(args[1]);
    if (result) {
      let embed = createEmbedItem(getItemById(id));
      message.channel.send({ embeds: [embed] });
    }
  }
    
});

client.login(process.env['API_Key']);
