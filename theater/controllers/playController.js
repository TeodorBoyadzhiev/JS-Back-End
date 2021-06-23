const router = require('express').Router();
const { isUser } = require('../middlewares/guards');
const { parseError } = require('../util/parsers');


router.get('/create', isUser(), (req, res) => {
    res.render('play/create');
});


router.post('/create', isUser(), async (req, res) => {
    try {

        const playData = {
            title: req.body.title,
            description: req.body.description,
            imageUrl: req.body.imageUrl,
            public: Boolean(req.body.public),
            author: req.user._id
        };

        await req.storage.createPlay(playData);

        res.redirect('/');
    } catch (err) {

        const ctx = {
            errors: parseError(err),
            playData: {
                title: req.body.title,
                description: req.body.description,
                imageUrl: req.body.imageUrl,
                public: Boolean(req.body.public)
            }
        };
        res.render('play/create', ctx);
    }


});


router.get('/details/:id', async (req, res) => {

    try {
        const play = await req.storage.getPlayById(req.params.id);


        play.hasUser = Boolean(req.user);
        play.isAuthor = req.user && req.user._id == play.author;
        play.liked = req.user && play.usersLiked.includes(req.user._id);

        res.render('play/details', { play });
    } catch (err) {
        console.log(err)
        res.redirect('/404');
    }

});



router.get('/edit/:id', async (req, res) => {

    try {

        const play = await req.storage.getPlayById(req.params.id);
        console.log(play)
        res.render('play/edit', { play });

    } catch (err) {


    }

});



router.get('/delete/:id', async (req, res) => {
    try {
        await req.storage.deletePlay(req.params.id);
        res.redirect('/');
    } catch (err) {

        res.redirect('/play/details/' + req.params.id);
    }


});

module.exports = router;