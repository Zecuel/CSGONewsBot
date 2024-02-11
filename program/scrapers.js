const rp = require("request-promise");
const $ = require("cheerio");

const MAX_CHAR_LIMIT = 2000;

class CsgoScraper {
  constructor() {
    this.url = "https://blog.counter-strike.net/index.php/category/updates/";
  }

  async getNewsLink() {
    const html = await rp(this.url);
    this.link = $("h2 > a", html)[0].attribs.href;
  }

  async getNewsTitle() {
    const html = await rp(this.link);
    this.title = $("h2 > a", html)[0].children[0].data;
  }

  async getNewsBody() {
    const html = await rp(this.link);
    let childCount = $("div.inner_post p", html).length;

    for (let i = 1; i < childCount; i++) {
      let childCount = $("div.inner_post p", html)[i].children.length;

      for (let y = 0; y < childCount; y++) {
        let data = $("div.inner_post p", html)[i].children[y].data;

        if (data && data !== "") {
          data = data.replace(/\n/g, "");
          output.push(data);
        }
      }
    }

    let body = "";

    for (const line of output) {
      if (body.length + line.length >= MAX_CHAR_LIMIT) {
        bodies.push(body);
        body = "";
      }

      body += line;

      if (!line.endsWith("\n")) {
        body += "\n";
      }
    }

    body += "\n";
    bodies.push(body);

    this.bodies = bodies;
  }
}

class OsrsScraper {
  constructor() {
    this.url = "https://oldschool.runescape.com/";
  }

  async getNewsLink() {
    const html = await rp(this.url);

    let articles = $("article.news-article", html);

    for (let i = 0; i < articles.length; i++) {
      if (
        $("span.news-article__sub", html)[i].children[0].data ===
        "Game Updates "
      ) {
        this.link = $("h3.news-article__title > a", html)[i].attribs.href;
        break;
      }
    }
  }

  async getNewsTitle() {
    let title = null;

    let terms = [
      "#osrsArticleHolder > div.left > h2",
      "#osrsArticleHolder > div.news-article-header__titles > h2",
    ];

    const html = await rp(this.link);

    for (const term of terms) {
      try {
        title = $(term, html)[0].children[0].data;
      } catch (error) {
        // no-op
      }
    }

    if (!title) {
      throw new Error("Couldn't find news title.");
    }

    this.title = title;
  }

  async getNewsBody() {
    const output = ["__**Update topics**__:"];
    const bodies = [];

    const html = await rp(this.link);
    let articleHolderChildren = null;

    const terms = ["div.news-article-content", "div.osrsArticleContentText"];

    for (const term of terms) {
      try {
        articleHolderChildren = $(term, html)[0].children;
      } catch (error) {
        // no-op
      }
    }

    if (!articleHolderChildren) {
      throw new Error("Couldn't find news body.");
    }

    for (const articleHolderChild of articleHolderChildren) {
      if (articleHolderChild.name !== "center") {
        continue;
      }

      for (const articleHolderGrandChild of articleHolderChild.children) {
        if (articleHolderGrandChild.name !== "font") {
          continue;
        }

        for (const textChild of articleHolderGrandChild.children) {
          if (textChild.type === "text" && textChild.data !== "\n") {
            let data = child.data.replace(/\n/g, "");
            output.push(data);
          }
        }
      }
    }

    let body = "";

    for (const line of output) {
      if (body.length + line.length >= MAX_CHAR_LIMIT) {
        bodies.push(body);
        body = "";
      }

      body += "- *" + line + "*\n";
    }

    bodies.push(body);
    this.bodies = bodies;
  }
}

class Dota2Scraper {
  constructor() {
    this.url = "http://www.dota2.com/news/updates/";
  }

  async getNewsLink() {
    const html = awaitrp(this.url);
    this.link = $("div[id^='post-'] > h2 > a", html)[0].attribs.href;
  }

  async getNewsTitle() {
    const html = await rp(this.link);
    this.title = $("div[id^='post-'] > h2 > a", html)[0].children[0].data;
  }

  async getNewsBody() {
    const output = [];
    const bodies = [];

    const html = await rp(this.link);
    let children = $(".entry-content", html)[0].children;

    for (const child of children) {
      if (child.type === "text" && child.data) {
        let data = child.data.replace(/\t/g, "").data.replace(/\n/g, "");
        output.push(data);
      }
    }

    let body = "";

    for (const line of output) {
      if (body.length + line.length >= MAX_CHAR_LIMIT) {
        bodies.push(body);
        body = "";
      }

      body += line + "\n";
    }

    bodies.push(body);
    this.bodies = bodies;
  }
}

module.exports = {
  CsgoScraper,
  OsrsScraper,
  Dota2Scraper,
};
