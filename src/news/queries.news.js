const NewsAPI = require('newsapi');
const newsapi = new NewsAPI(process.env.NEWS_API_KEY);

module.exports = {
  topHeadlines(callback) {
    newsapi.v2.topHeadlines({
      language: 'en',
      pageSize: 49
    })
    .then((stories) => {
      callback(null, stories.articles);
    })
    .catch((err) => {
      callback(err);
    })
  }
};
