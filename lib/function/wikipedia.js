const wikijs = require("wikijs").default
const { fetchJson, fetchText } = require('../../util/fetcher')

const wiki = async (query) => {
  try {
    let summary
    const page = wikijs({ apiUrl: 'https://id.wikipedia.org/w/api.php' }).page(query)
    if (page){
      summary = await page.chain().summary().image().request()
      const picUrl = summary.image.source || summary.thumbnail.source;
      const caption = `_*Judul* : ${summary.title}_\n_*Deskripsi* : ${summary.extract}_`;
      return { picUrl, caption };
    }
    //const summary = await page.summary();
  } catch (ex) {
    return console.log("Error Wikipedia: ", ex);
  }
};

module.exports = {
  wiki,
};