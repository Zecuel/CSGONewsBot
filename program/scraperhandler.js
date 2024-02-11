const scrapers = require("./scrapers");

async function getUpdate(scraper) {
  await scraper.getNewsLink();

  if (!scraper.link) {
    throw new Error("Error while getting news article link.");
  }

  await Promise.all([scraper.getNewsTitle(), scraper.getNewsBody()]);

  if (!scraper.title) {
    throw new Error("Error while getting news article title.");
  }

  if (!scraper.bodies) {
    throw new Error("Error while getting news article body.");
  }

  return [scraper.link, scraper.title, scraper.bodies];
}

async function getCsgoUpdate() {
  const scraper = new scrapers.CsgoScraper();
  return getUpdate(scraper);
}

async function getOsrsUpdate() {
  const scraper = new scrapers.OsrsScraper();
  return getUpdate(scraper);
}

async function getDota2Update() {
  const scraper = new scrapers.Dota2Scraper();
  return getUpdate(scraper);
}

module.exports = {
  getCsgoUpdate,
  getOsrsUpdate,
  getDota2Update,
};
