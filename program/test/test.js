const mocha = require("mocha");
const assert = require("assert");
const commands = require("../commands");

const describe = mocha.describe;

const getCommandDescription =
  require("../misc/functions").getCommandDescription;

describe("getCommandDescription", () => {
  it('should show description for "!nb help"', () => {
    let command = "help";
    command = commands[command];

    const expectedResult =
      "\n" +
      "Name:                 help\n" +
      "Command:         !nb help\n" +
      "Description:       Show useful information about a command or show list of commands.\n" +
      "\n" +
      "Syntax:                !nb help ?<command>\n" +
      "Example:             !nb help getupdate\n" +
      "\n" +
      "If a command parameter includes a question mark (?), that parameter is optional.";

    const result = getCommandDescription(command);
    assert.strictEqual(result, expectedResult);
  });

  it('should show description for "!nb addgame"', () => {
    let command = "addgame";
    command = commands[command];

    const expectedResult =
      "\n" +
      "Name:                 addgame\n" +
      "Command:         !nb addgame\n" +
      "Description:       Adds current channel to update article schedule for the given game.\n" +
      "\n" +
      "Syntax:                !nb addgame <game>\n" +
      "Example:             !nb addgame csgo\n" +
      "\n" +
      "Allowed argument values: csgo,osrs,dota2" +
      "\n\n" +
      "If a command parameter includes a question mark (?), that parameter is optional.";

    const result = getCommandDescription(command);
    assert.strictEqual(result, expectedResult);
  });

  it('should show description for "!nb removegame"', () => {
    let command = "removegame";
    command = commands[command];

    const expectedResult =
      "\n" +
      "Name:                 removegame\n" +
      "Command:         !nb removegame\n" +
      "Description:       Removes current channel from update article schedule for the given game.\n" +
      "\n" +
      "Syntax:                !nb removegame <game>\n" +
      "Example:             !nb removegame csgo\n" +
      "\n" +
      "Allowed argument values: csgo,osrs,dota2" +
      "\n\n" +
      "If a command parameter includes a question mark (?), that parameter is optional.";

    const result = getCommandDescription(command);
    assert.strictEqual(result, expectedResult);
  });

  it('should show description for "!nb news"', () => {
    let command = "news";
    command = commands[command];

    const expectedResult =
      "\n" +
      "Name:                 news\n" +
      "Command:         !nb news\n" +
      "Description:       Sends the latest news article for the given game to current channel.\n" +
      "\n" +
      "Syntax:                !nb news <game>\n" +
      "Example:             !nb news csgo\n" +
      "\n" +
      "Allowed argument values: csgo,osrs,dota2" +
      "\n\n" +
      "If a command parameter includes a question mark (?), that parameter is optional.";

    const result = getCommandDescription(command);
    assert.strictEqual(result, expectedResult);
  });

  it('should show description for "!nb schedulestart"', () => {
    let command = "schedulestart";
    command = commands[command];

    const expectedResult =
      "\n" +
      "Name:                 schedulestart\n" +
      "Command:         !nb schedulestart\n" +
      "Description:       Starts update schedule.\n" +
      "\n" +
      "Syntax:                !nb schedulestart\n" +
      "Example:             !nb schedulestart\n" +
      "\n" +
      "If a command parameter includes a question mark (?), that parameter is optional.";

    const result = getCommandDescription(command);
    assert.strictEqual(result, expectedResult);
  });

  it('should show description for "!nb schedulestop"', () => {
    let command = "schedulestop";
    command = commands[command];

    const expectedResult =
      "\n" +
      "Name:                 schedulestop\n" +
      "Command:         !nb schedulestop\n" +
      "Description:       Stops update schedule.\n" +
      "\n" +
      "Syntax:                !nb schedulestop\n" +
      "Example:             !nb schedulestop\n" +
      "\n" +
      "If a command parameter includes a question mark (?), that parameter is optional.";

    const result = getCommandDescription(command);
    assert.strictEqual(result, expectedResult);
  });
});
