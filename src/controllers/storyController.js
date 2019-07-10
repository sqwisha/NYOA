const SavedStory = require('../db/models').SavedStory;


module.exports = {
  saveStory(req, res, next) {
    SavedStory.create({
      userId: req.user.id,
      story: JSON.parse(req.body.story)
    })
    .then((story) => {
      req.flash('notice', 'Story saved!');
      res.redirect('/')
    })
    .catch((err) => {
      req.flash('error', `An error occurred: ${err}`);
      res.redirect('/');
    });
  }
}
