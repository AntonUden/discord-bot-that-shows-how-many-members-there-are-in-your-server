import Express from "express";
import Discord, { Channel, Client, Guild, GuildMember, Message, TextChannel, User } from "discord.js";

export default class Bot {
	public static instance: Bot;

	private _express: Express.Application;
	private _client: Client;
	
	private guildId: string;
	

	private data: any = {};

	constructor(token: string, guildId: string, port: number) {
		Bot.instance = this;
		this.guildId = guildId;

		const cors = require('cors');
		const helmet = require('helmet');

		this._express = Express();
		this._express.disable('x-powered-by');
		this._express.use(cors());
		this._express.use(helmet());

		this._express.get('/', function (req: Express.Request, res: Express.Response) {
			res.header("Content-Type", 'application/json');
			res.send(JSON.stringify(Bot.instance.data, null, 4));
		});

		this._client = new Discord.Client();
		this._client.login(token);

		this._client.on('ready', () => {
			console.log(`Logged in as ${this._client.user.tag}!`);
			Bot.instance.update();
		});

		this._client.on("disconnect", async function (event) {
			console.log(`The WebSocket has closed and will no longer attempt to reconnect`);
		});

		this._express.listen(port);
		console.log("Web server listening on port " + port);

		setInterval(function() {
			Bot.instance.update();
		}, 5000);
	}

	public async update() {
		let guild: Guild = await this._client.guilds.fetch(this.guildId);

		let newData: any = {};
		newData.total_member_count = 0;

		guild.members.cache.forEach(function(member: GuildMember) {
			newData.total_member_count++;
		});

		this.data = newData;
	}
}