const mysql = require("mysql");
const privateValues = require("./private");

class Database {
  constructor() {
    // Create new connection pool upon construction
    this.connectionPool = mysql.createPool({
      host: privateValues.host,
      user: privateValues.user,
      password: privateValues.password,
    });
  }

  query(sql, args) {
    return new Promise((resolve, reject) => {
      this.connectionPool.getConnection((error, connection) => {
        if (error) {
          return reject(error);
        }

        connection.query(sql, args, (error, result) => {
          connection.release();

          if (error) {
            return reject(error);
          }

          resolve(result);
        });
      });
    });
  }

  /**
   * Add new Discord channel to DB
   */
  async addGame(game, channelID) {
    if (!game || !channelID) {
      throw new Error("Invalid arguments in command.");
    }

    let sql =
      "SELECT COUNT(*) as count FROM NewsBot.channels WHERE game = ? && channelID = ?";

    let args = [game, channelID];

    let result = await this.query(sql, args);

    if (result[0].count === 0) {
      sql = "INSERT INTO NewsBot.channels (game, channelID) VALUES (?, ?)";
      await this.query(sql, args);

      return true;
    }

    return false;
  }

  /**
   * Remove Discord channel from DB
   */
  async removeGame(game, channelID) {
    if (!game || !channelID) {
      throw new Error("Invalid arguments in command.");
    }

    let sql = "DELETE FROM NewsBot.channels WHERE game = ? && channelID = ?";
    let args = [game, channelID];

    return await this.query(sql, args);
  }

  /**
   * Get all stored Discord channels from DB
   */
  async getChannels(game) {
    if (!game) {
      throw new Error("Invalid arguments in command.");
    }

    let sql = "SELECT (channelID) FROM NewsBot.channels where game = ?";
    let args = [game];

    let result = await this.query(sql, args);

    const output = [];

    for (const row of result) {
      output.push(row.channelID);
    }

    return output;
  }

  /**
   * Check if news article has already been shown
   */
  async newsArticleExists(game, title) {
    let sql =
      "SELECT COUNT(*) as count FROM NewsBot.newsitems WHERE game = ? && title = ?";

    let args = [game, title];

    let result = await this.query(sql, args);
    return result[0].count > 0;
  }

  /**
   * Add news article to list of already shown articles
   */
  async addNewsArticle(game, title) {
    let sql = "INSERT INTO NewsBot.newsitems (game,title) VALUES (?, ?)";
    let args = [game, title];

    return await this.query(sql, args);
  }
}

module.exports = Database;
