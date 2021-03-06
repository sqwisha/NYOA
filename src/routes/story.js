const express = require('express');
const router = express.Router();
const auth = require('../auth/helpers');

const storyController = require('../controllers/storyController');

router.post('/story/save', auth.ensureAuthenticated, storyController.saveStory);
router.get('/story/saved_stories', auth.ensureAuthenticated, storyController.getUserStories);
router.post('/story/unsave', auth.ensureAuthenticated, storyController.deleteStory);

module.exports = router;
