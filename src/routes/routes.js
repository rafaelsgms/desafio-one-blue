const express = require('express');

const { registerUser, login, editUser, viewUser, deleteUser } = require('../controller/users');
const { registerQuote, editQuote } = require('../controller/quote');
const tokenValidation = require('../middleware/tokenValidation');

const router = express();

router.post('/user', registerUser);
router.post('/login', login);

router.use(tokenValidation);

router.put('/user', editUser);
router.get('/user', viewUser);
router.delete('/user', deleteUser);

router.post('/quote', registerQuote);
router.put('/quote/:id', editQuote);

module.exports = router;