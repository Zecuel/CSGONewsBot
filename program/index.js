const discordjs = require("discord.js");
const SchedulerCL = require("./scheduler");
const commands = require("./commands");
const privateValues = require("./private");

const client = new discordjs.Client();
const adminId = privateValues.AdminID;

client.login(privateValues.BotPass);

client.on("ready", () => {
  console.info("Bot connected!");

  const Scheduler = new SchedulerCL();
  Scheduler.startSchedule();

  client.on("message", (message) => {
    let handler = new CommandHandler(message);
    handler.handleMessage();
  });
});

class CommandHandler {
  constructor(message) {
    this.message = message;
  }

  async handleMessage() {
    // Split command by space
    let args = this.message.toString().split(" "),
      command = args[0];

    // Remove prefix from args
    args.splice(0, 1);

    /* Ignore non-commands */
    if (!command.startsWith("!nb")) {
      return;
    }

    command = args[0];

    // Remove command from args
    args.splice(0, 1);

    // From a Command -object
    if (command in commands) {
      command = commands[command];
    } else {
      return this.message.reply(
        "Unknown command: " + command + '\nIf you need help, type "!nb help"'
      );
    }

    // Check for admin requirement
    if (command.requireAdmin && this.message.author.id !== adminId) {
      return this.message.reply(
        `Admin privileges are required to run ${command.name}.`
      );
    }

    // Validate arguments
    if (!(command.argvalues === undefined || command.argvalues.length === 0)) {
      let invalidCommand = [false, undefined];

      for (const arg of args) {
        if (command.argvalues.indexOf(arg) === -1) {
          invalidCommand = [true, arg];
        }
      }

      if (invalidCommand[0]) {
        return this.message.reply(
          "Invalid command argument: " + invalidCommand[1]
        );
      }
    }

    try {
      const result = await command.run(this.message, args);

      if (result.name !== "sendupdate") {
        return this.message.reply(result);
      }

      for (const channelId of result.channels) {
        const channel = client.channels.get(channelId);
        let embed = result.embed;

        channel.send(result.messageTitle);

        for (const body of result.bodies) {
          channel.send(body);
        }

        if (embed) {
          channel.send("", { embed });
        }
      }
    } catch (err) {
      console.error(err);
      return this.message.reply(err.message);
    }
  }
}
