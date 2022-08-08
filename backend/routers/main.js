const router = require('express').Router();
const {roomContent, roomAmountOfMessage, roomUnreadContent} = require('../controllers/http/messages');
const {addToBlacklist, removeFromBlacklist, getBlacklist} = require('../controllers/http/user');
const {checkJWT} = require('../controllers/http/auth');

router.use(checkJWT);

router.get('/roomContent/:id', roomContent);

router.get('/roomUnreadContent/:id', roomUnreadContent);

router.get('/roomAmountOfMessage/:id', roomAmountOfMessage);

router.get('/blacklist', getBlacklist);

router.post('/blacklist', addToBlacklist);

router.delete('/blacklist', removeFromBlacklist);

module.exports = router;