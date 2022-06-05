# Notes for Project

The following notes are for reference for future Discord.js projects.

---

Occurs when a message is sent on a server the bot is apart of.

```js
client.on("messageCreate", (message) => {...});
```

Checks for specific message; returns bool.

```js
message.content.startsWith(...);
```
Sends message to the channel that sent it.

```js
message.channel.send(...);
```

Backticks may be used for string literals, which allow for expressions.

```js
const x = `string text ${expression} string text`;
```

Variable for user who originally sent caught message.

```js
message.author.username;
```

Send an embeded message.

```js
message.channel.send({ embeds: [exampleEmbed] });
```

Example of an embeded message object initialized via constructors.

```js
const exampleEmbed = new MessageEmbed()
	.setColor('#0099ff')
	.setTitle('Some title')
	.setURL('https://discord.js.org/')
	.setDescription('Some description here')
	.setThumbnail('https://i.imgur.com/AfFp7pu.png')
	.addFields(
		{ name: 'Regular field title', value: 'Some value here' },
		{ name: '\u200B', value: '\u200B' },
		{ name: 'Inline field title', value: 'Some value here', inline: true },
		{ name: 'Inline field title', value: 'Some value here', inline: true },
	)
	.addField('Inline field title', 'Some value here', true)
	.setImage('https://i.imgur.com/AfFp7pu.png')
	.setTimestamp()
	.setFooter({ text: 'Some footer text here', iconURL: 'https://i.imgur.com/AfFp7pu.png' });
 ```