# What is NewsBot?

NewsBot is a Discord bot which crawls various game's websites, such as the
[CS:GO updates](https://blog.counter-strike.net/index.php/category/updates/) 
-page or [OSRS homepage](https://oldschool.runescape.com/) and checks for new news articles every 30 minutes.

Whenever there is a new article, it will send the article as a Discord message to all Discord channels 
that are subscribed to that game's news schedule.

**Purpose**: The purpose of this Discord bot is to automate sending updates about various games to Discord servers. 
This makes it easy to keep track of game updates without leaving the comfort of your Discord server.

## List of supported games

* CS:GO
* Oldschool Runescape
* Dota2

## How to use the bot
* Invite this bot to your Discord server with 
[this link](https://discordapp.com/api/oauth2/authorize?client_id=562687174697549856&permissions=522304&scope=bot).

* All commands start with `!nb`. To get a list of supported commands, run `!nb help`.

Useful commands:
  * Add the desired game to the news schedule by running the command `!nb addgame <game>`.<br>
  Updates will be sent to the channel this command was run on.

  * If you want to remove a game from the news schedule, run the command `!nb removegame <game>`. <br>
  The current channel will be removed from the news schedule.

  * Get the latest news article instantly by running the command `!nb news <game>` on the desired Discord 
text channel.

## Changelog

**10/09/2019**
* Fixed bug with OSRS news scraper.
 
### Licence 
This repository is licenced under the MIT license. 
Anyone is allowed to modify, share or use this repository, even commercially.
