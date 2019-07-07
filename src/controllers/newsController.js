const newsQueries = require('../news/queries.news');

module.exports = {
  index(req, res, next) {
    newsQueries.topHeadlines((err, stories) => {
      if (err) {
        console.log('Error: ', err);
      } else {
        const mainStory = stories.shift();
        res.render('index', {mainStory, stories});
      }
    });
  }
};
