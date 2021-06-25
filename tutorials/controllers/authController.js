const router = require('express').Router();

const { body, validationResult } = require('express-validator'); //TODTODOOTODODO



router.get('/register', (req, res) => {

    res.render('user/register');
});



router.post('/register', (req, res) => {

    res.render('/');
});


router.get('/login', async (req, res) => {

    res.render('user/login');

});


router.post('/login', async (req, res) => {

    res.redirect('/');

});


router.get('/logout', async (req, res) => {

    res.redirect('/');

});

module.exports = router;
