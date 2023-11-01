const router = require('express').Router();
const {register, login, whoAmI} = require('../controllers/auth.controllers');
const {restrict} = require('../middlewares/auth.middlewares');

router.post('/register', register);
router.post('/login', login);
router.get('/whoami', restrict, whoAmI);

module.exports = router;