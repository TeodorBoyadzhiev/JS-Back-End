const router = require('express').Router();
const { body, validationResult } = require('express-validator');
const { isGuest } = require('../middlewares/guards');

router.get('/register', isGuest(), (req, res) => {
    res.render('user/register');
});

router.post('/register', isGuest(),
    body('fullName').matches(/^\w+\s\w+$/).withMessage('Fullname should be in format "Firstname Lastname" with space between!'),
    body('username').isLength({ min: 5 }).withMessage('Username should be at least 5 characters long!'),
    body('password').isLength({ min: 4 }).withMessage('Password should be at least 4 characters long'),
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
                const message = errors.map(e => e.msg).join('\n');
                throw new Error(message);
            }
            console.log(req.body)
            await req.auth.register(req.body.fullName, req.body.username, req.body.password);

            res.redirect('/');

        } catch (err) {
            const ctx = {
                errors: err.message.split('\n'),
                userData: {
                    fullName: req.body.fullName,
                    username: req.body.username
                }
            };
            res.render('user/register', ctx);
        }

    }
);


router.get('/login', isGuest(), (req, res) => {
    res.render('user/login');
});

router.post('/login', isGuest(),
    body('username').isLength({ min: 5 }).withMessage('Username should be at least 5 characters long!').bail(),
    body('password').isLength({ min: 4 }).withMessage('Password should be at least 4 characters long'),

    async (req, res) => {
        const { errors } = validationResult(req);

        try {
            if (errors.length > 0) {
                const message = errors.map(e => e.msg).join('\n');
                throw new Error(message);
            }
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