const router = require('express').Router();

const { parseError } = require('../util/parsers');
const { body, validationResult } = require('express-validator');
const { isGuest } = require('../middlewares/guards');



router.get('/register', isGuest(), (req, res) => {

    res.render('user/register');
});



router.post('/register',
    isGuest(),
    body('username')
        .isLength({ min: 5 })
        .withMessage('Username must be at least 5 charecters long!').bail()
        .matches(/[a-zA-z0-9]/).withMessage('Username may contain only english letters and numbers!'),
    body('password')
        .isLength({ min: 5 })
        .withMessage('Password must be at least 5 charecters long!').bail()
        .matches(/[a-zA-z0-9]/).withMessage('Password may contain only english letters and numbers!'),
    body('rePass').custom((value, { req }) => {
        if (value != req.body.password) {
            throw new Error('Passwords dont match');
        }
        return true;
    }),
    async (req, res) => {
        const { errors } = validationResult(req);

        try {
            if (errors.length > 0) {
                const message = errors.map(e => e.msg).join('\n');
                throw new Error(message);
            }
            await req.auth.register(req.body.username, req.body.password);

            res.redirect('/');

        } catch (err) {
            console.log(err);
            const ctx = {
                errors: err.message.split('\n'),
                userData: {
                    username: req.body.username,
                }
            };

            res.render('user/register', ctx);
        }

    });


router.get('/login', isGuest(), async (req, res) => {

    res.render('user/login');

});



router.post('/login',isGuest(),async (req, res) => {
    try {
        await req.auth.login(req.body.username, req.body.password);

        res.redirect('/');
    } catch (err) {
        const ctx = {
            errors: [err.message],
            userData: {
                username: req.body.username,
            }
        };
        res.render('user/login', ctx);
    }
});


router.get('/logout', async (req, res) => {
    req.auth.logout();
    res.redirect('/');

});

module.exports = router;
