const Validator = require("./validator");
const DatabaseCL = require("./database");
const SchedulerCL = require("./scheduler");
const functions = require("./misc/functions");

const Database = new DatabaseCL();
const Scheduler = new SchedulerCL();

const SUPPORTED_GAMES = ["csgo", "osrs", "dota2"];

const commands = {
  help: {
    requireAdmin: false,
    name: "help",
    command: "!nb help",
    description:
      "Show useful information about a command or show list of commands.",
    syntax: "!nb help ?<command>",
    example: "!nb help getupdate",
    argvalues: [],
    run: async function (message, args) {
      let response;

      if (Validator.validateArguments(args)) {
        let command = commands[args[0]];

        if (!command) {
          throw new Error("Invalid arguments in command.");
        }

        response = functions.getCommandDescription(command);
      } else {
        response = "";
        response +=
          'To learn more about a command, type "!nb help <command>".\n';
        response += "Here are all of my commands:\n\n";

        for (let key in commands) {
          response += commands[key].command + "\n";
        }
      }

      return response;
    },
  },
  addgame: {
    requireAdmin: false,
    name: "addgame",
    command: "!nb addgame",
    description:
      "Adds current channel to update article schedule for the given game.",
    syntax: "!nb addgame <game>",
    example: "!nb addgame csgo",
    argvalues: SUPPORTED_GAMES,
    run: async function (message, args) {
      if (!Validator.validateArguments([args[0], message.channel.id])) {
        throw new Error("Invalid arguments in command.");
      }

      if (!(await Database.addGame(args[0], message.channel.id))) {
        throw new Error("Something went wrong while adding game.");
      }

      return "Game successfully added!";
    },
  },
  removegame: {
    requireAdmin: false,
    name: "removegame",
    command: "!nb removegame",
    description:
      "Removes current channel from update article schedule for the given game.",
    syntax: "!nb removegame <game>",
    example: "!nb removegame csgo",
    argvalues: SUPPORTED_GAMES,
    run: async function (message, args) {
      if (!Validator.validateArguments([args[0], message.channel.id])) {
        throw new Error("Invalid arguments in command.");
      }

      if (!(await Database.removeGame(args[0], message.channel.id))) {
        throw new Error("Something went wrong while removing game.");
      }

      return "Game successfully removed.";
    },
  },
  news: {
    requireAdmin: false,
    name: "news",
    command: "!nb news",
    description:
      "Sends the latest news article for the given game to current channel.",
    syntax: "!nb news <game>",
    example: "!nb news csgo",
    argvalues: SUPPORTED_GAMES,
    run: async function (message, args) {
      if (!Validator.validateArguments([args[0]])) {
        throw new Error("Invalid arguments in command.");
      }

      message
        .reply("Getting news article, please wait...")
        .then((msg) => msg.delete(3500));

      return await functions.sendNewsArticle(args[0], [message.channel.id]);
    },
  },
  schedulestart: {
    requireAdmin: true,
    name: "schedulestart",
    command: "!nb schedulestart",
    description: "Starts update schedule.",
    syntax: "!nb schedulestart",
    example: "!nb schedulestart",
    argvalues: [],
    run: async function () {
      return Scheduler.startSchedule();
    },
  },
  schedulestop: {
    requireAdmin: true,
    name: "schedulestop",
    command: "!nb schedulestop",
    description: "Stops update schedule.",
    syntax: "!nb schedulestop",
    example: "!nb schedulestop",
    argvalues: [],
    run: async function () {
      return Scheduler.stopSchedule();
    },
  },
};

module.exports = commands;
