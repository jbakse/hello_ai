// first deployment failed due to limitation in deployctl
// manually setting env variables works
// https://github.com/denoland/deployctl/issues/311

/// Setting up your bot
/// Go here https://discord.com/developers/applications
/// Open your bot.
/// Go to the OAuth2 tab.
/// Select the bot scope.
/// Select the bot permissions.
/// You need Send Messages and Read Message History permissions.
/// Copy the URL and paste it in your browser.

// this works but doesn't keep the gateway open
// the bot sleeps, and can be woken up by trying its url
// there is no web server part in this demo, so you don't get anything
// but it does wake up
// could switch to endpoint url

import { Client, GatewayIntentBits } from "npm:discord.js";
import { load } from "https://deno.land/std@0.224.0/dotenv/mod.ts";
import { promptGPT } from "../../shared/openai.ts";

const { DISCORD_TOKEN } = await load();

const client = new Client({
  intents: [
    // guildCreate, channelCreate, threadCreate, etc
    GatewayIntentBits.Guilds,
    // messageCreate, etc
    GatewayIntentBits.GuildMessages,
    // permits app to receive message content
    GatewayIntentBits.MessageContent,
  ],
});

client.on("ready", () => {
  console.log("event: ready");
  console.log(`Tag is ${client.user.tag}`);
});

client.on("messageCreate", async (message) => {
  console.log("event: messageCreate");

  const reaction = await promptGPT(
    `Read the following message and then reply using a single emoji.
            Avoid face emojis. 
            ${message.content}`,
    { max_tokens: 5 },
  );
  message.react(reaction);

  console.log(`Reacting with ${reaction}`);
});

console.log(Deno.env.toObject());
client.login(DISCORD_TOKEN);
