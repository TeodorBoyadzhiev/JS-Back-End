const router = require('express').Router();
const { body, validationResult } = require('express-validator');

const { isGuest } = require('../middlewares/guards');



router.get('/register',  (req, res) => {
    res.render('register');
});

router.post('/register', (req, res) => {
    res.render('register');
});


router.get('/login',  (req, res) => {
    res.render('login');
});

router.post('/login', (req, res) => {
    res.render('login');
});


router.get('/logout', (req, res) => {
    req.auth.logout();
    res.redirect('/');
});


module.exports = router;