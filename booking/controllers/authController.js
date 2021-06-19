const router = require('express').Router();
const { body, validationResult } = require('express-validator');
const { isUser, isGuest } = require('../middlewares/guards');

router.get('/register', isGuest(), (req, res) => {
    res.render('user/register');
});

router.post('/register', isGuest(),
    body('username').isLength({ min: 3 }),
    body('rePass').custom((value, { req }) => {
        if (value != req.body.password) {
            throw new Error('Passwords don\'t match');
        }
        return true;
    }),
    async (req, res) => {
        const { errors } = validationResult(req);

        try {
            if (errors.length > 0) {
                throw new Error('Validation error');
            }
            await req.auth.register(req.body.username, req.body.password);

            res.redirect('/');

        } catch (err) {
            const ctx = {
                errors,
                userData: {
                    username: req.body.username,
                }
            };

            res.render('user/register', ctx);
        }

    }
);


router.get('/login', isGuest(), (req, res) => {
    res.render('user/login');
});

router.post('/login', isGuest(), async (req, res) => {
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

router.get('/logout', (req, res) => {
    req.auth.logout();
    res.redirect('/');
});


module.exports = router;