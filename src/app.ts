import * as fs from "fs";
import Bot from "./Bot";

const configFile = "./config.json";
if(!fs.existsSync(configFile)) {
	let defaultConfig = {
		"token": "DISCORD_TOKEN_HERE",
		"guild_id": "GUILD_ID_HERE",
		"port": 8123
	}
	fs.writeFileSync(configFile, JSON.stringify(defaultConfig, null, 4), 'utf8');
}

const configJson: any = JSON.parse(fs.readFileSync(configFile, 'utf8'));

const token: string = configJson.token;
const guildId: string = configJson.guild_id;
const port: number = configJson.port;

new Bot(token, guildId, port);