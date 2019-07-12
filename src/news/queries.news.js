const NewsAPI = require('newsapi');
const newsapi = new NewsAPI(process.env.NEWS_API_KEY);

module.exports = {
  topHeadlines(callback) {
    newsapi.v2.topHeadlines({
      language: 'en',
      pageSize: 49
    })
    .then((stories) => {
      let articles = stories.articles;
      // fill in missing data
      for (var i = articles.length - 1; i >= 0; i--) {
        if (articles[i].title === '' || !articles[i].title) {
          articles.splice(i, 1);
        }
        if (!articles[i].urlToImage) {
          articles[i].urlToImage = 'http://loremflickr.com/400/224/travel';
        }
        if (!articles[i].description) {
          articles[i].description = articles[i].title || articles[i].content;
        }
        if (articles[i].content) {
          articles[i].content = articles[i].description || articles[i].title;
        }
      }

      callback(null, articles);
    })
    .catch((err) => {
      callback(err);
    })
  }
};
