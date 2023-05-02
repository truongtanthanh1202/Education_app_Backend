const express = require('express');
const router = express.Router();
const SearchController = require('../app/controller/Searchcontroller');
router.use('/render_course/:id/:title', SearchController.renderSearch);
router.post('/search_keyword', SearchController.search);
router.post('/search', SearchController.searchKeyWord);
module.exports = router;
