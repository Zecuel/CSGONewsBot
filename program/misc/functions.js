const discordjs = require("discord.js");
const DatabaseCL = require("../database");
const ScraperHandler = require("../scraperhandler");

function replaceWithBold(text) {
  return `\n**${text}**`;
}

function getCommandDescription(command) {
  let output = "\n";

  output += "Name:                 " + command.name + "\n";
  output += "Command:         " + command.command + "\n";
  output += "Description:       " + command.description + "\n\n";
  output += "Syntax:                " + command.syntax + "\n";
  output += "Example:             " + command.example + "\n";

  if (!(command.argvalues === undefined || command.argvalues.length === 0)) {
    output += "\nAllowed argument values: " + command.argvalues + "\n";
  }

  output +=
    "\nIf a command parameter includes a question mark (?), that parameter is optional.";

  return output;
}

async function sendNewsArticle(game, channels = [], sender = "user") {
  const Database = new DatabaseCL();

  console.info("Sending news article...");

  let scraperOutput, link, title, bodies, image, messageTitle;

  if (sender === "bot") {
    channels = await Database.getChannels(game);
  }

  switch (game) {
    case "csgo": {
      image = "counter_strike_wallpaper.png";

      scraperOutput = await ScraperHandler.getCsgoUpdate();

      link = scraperOutput[0];
      title = scraperOutput[1];

      const outputBodies = scraperOutput[2];

      messageTitle = "__**Latest CS:GO news:**__";

      if (sender === "bot") {
        messageTitle = "__**New CS:GO update released!**__";
        const exists = await Database.newsArticleExists(game, title);

        if (exists) {
          return console.info("Old article.");
        }
      }

      for (let mutableBody of outputBodies) {
        mutableBody = mutableBody.replaceAll(
          /(\[[A-Za-z0-9]+])/g,
          replaceWithBold
        );

        mutableBody = mutableBody.replaceAll(
          /([A-Za-z0-9]+[:])/g,
          replaceWithBold
        );

        bodies.push(mutableBody);
      }

      break;
    }

    case "osrs": {
      image = "oldschool.png";

      scraperOutput = await ScraperHandler.getOsrsUpdate();

      link = scraperOutput[0];
      title = scraperOutput[1];
      bodies = scraperOutput[2];

      messageTitle = "__**Latest OSRS news:**__";

      if (sender === "bot") {
        messageTitle = "__**New OSRS update release!**__";
        const exists = await Database.newsArticleExists(game, title);

        if (exists) {
          return console.info("Old article.");
        }
      }

      break;
    }

    case "dota2": {
      image = "dota2.jpg";

      scraperOutput = await ScraperHandler.getDota2Update();

      link = scraperOutput[0];
      title = scraperOutput[1];

      const outputBodies = scraperOutput[2];

      messageTitle = "__**Latest DOTA2 news:**__";

      if (sender === "bot") {
        messageTitle = "__**New DOTA2 update release!**__";
        const exists = await Database.newsArticleExists(game, title);

        if (exists) {
          return console.info("Old article.");
        }
      }

      for (let mutableBody of outputBodies) {
        mutableBody = mutableBody.replaceAll(/\t/g, "");
        bodies.push(mutableBody);
      }

      break;
    }

    default: {
      throw new Error("Invalid game: " + game);
    }
  }

  if (!scraperOutput || !channels) {
    throw new Error("Invalid arguments in command.");
  }

  bodies[0] = "_ _\n_ _\n" + bodies[0];

  const finalBodies = bodies.map((body) => body.replace(undefined, ""));

  const embed = new discordjs.RichEmbed()
    .setTitle(`__**${title}**__`)
    .setURL(link)
    .setColor(524419);

  if (image) {
    embed.attachFiles([`./images/${image}`]).setImage(`attachment://${image}`);
  }

  if (sender === "bot") {
    if (!(await Database.addNewsArticle(game, title))) {
      return console.error("Error while adding news article to DB!");
    }
  }

  return {
    name: "sendupdate",
    channels: channels,
    messageTitle: messageTitle,
    bodies: finalBodies,
    embed: embed,
  };
}

module.exports = {
  getCommandDescription,
  sendNewsArticle,
};
