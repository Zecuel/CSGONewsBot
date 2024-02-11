const discordjs = require("discord.js");
const privateValues = require("./private");
const cron = require("node-cron");
const functions = require("./misc/functions");

class Scheduler {
  cronSchedule;

  constructor(cronTimer = "0 */15 * * * *") {
    if (!cron.validate(cronTimer)) {
      return console.error("Invalid cron timer.");
    }

    this.cronSchedule = cron.schedule(
      cronTimer,
      async () => {
        console.info("News getter scheduled...");

        const csgoResult = await functions.sendNewsArticle("csgo", [], "bot");
        const osrsResult = await functions.sendNewsArticle("osrs", [], "bot");
        const dota2Result = await functions.sendNewsArticle("dota2", [], "bot");

        const client = new discordjs.Client();
        client.login(privateValues.BotPass);

        client.on("ready", async () => {
          if (csgoResult) {
            await this.sendNewsArticle(
              client,
              csgoResult.channels,
              csgoResult.messageTitle,
              csgoResult.bodies,
              csgoResult.embed
            );
          }

          if (osrsResult) {
            await this.sendNewsArticle(
              client,
              osrsResult.channels,
              osrsResult.messageTitle,
              osrsResult.bodies,
              osrsResult.embed
            );
          }

          if (dota2Result) {
            await this.sendNewsArticle(
              client,
              dota2Result.channels,
              dota2Result.messageTitle,
              dota2Result.bodies,
              dota2Result.embed
            );
          }
        });

        client.destroy();
      },
      { scheduled: false, timezone: "Europe/Helsinki" }
    );
  }

  async sendNewsArticle(client, channelIds, messageTitle, bodies, embed) {
    for (const channelId of channelIds) {
      const channel = client.channels.get(channelId);

      if (!channel) {
        return console.error(`Unavailable channel: ${channelId}`);
      }

      try {
        await channel.send(messageTitle);

        for (const body of bodies) {
          await channel.send(body);
        }

        if (embed) {
          await channel.send(embed);
        }
      } catch (error) {
        return console.error(error);
      }
    }
  }

  startSchedule() {
    console.info("Starting cron schedule...");
    this.cronSchedule.start();
    return "Cron schedule started successfully!";
  }

  stopSchedule() {
    console.info("Stopping cron schedule...");
    this.cronSchedule.stop();
    return "Cron schedule stopped successfully.";
  }
}

module.exports = Scheduler;
