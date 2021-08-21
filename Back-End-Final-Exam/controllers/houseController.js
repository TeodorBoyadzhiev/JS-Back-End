const router = require('express').Router();
const { isUser } = require('../middlewares/guards');
const { parseError } = require('../util/parsers');


router.get('/create', isUser(), (req, res) => {
    res.render('house/create');
});


router.post('/create', isUser(), async (req, res) => {
    try {

        const houseData = {
            name: req.body.name,
            type: req.body.type,
            year: req.body.year,
            city: req.body.city,
            homeImg: req.body.homeImg,
            description: req.body.description,
            pieces: Number(req.body.pieces),
            owner: req.user._id,
        };

        console.log(req.body)

        await req.storage.createHouse(houseData);

        res.redirect('/house/houses');
    } catch (err) {
        console.log(err);
        const ctx = {
            errors: parseError(err),
            houseData: {
                name: req.body.name,
                type: req.body.type,
                year: req.body.year,
                city: req.body.city,
                homeImg: req.body.homeImg,
                description: req.body.description,
                pieces: Number(req.body.pieces),
            }
        };
        res.render('house/create', ctx);
    }


});


router.get('/houses', async (req, res) => {

    const houses = await req.storage.getAllHouses();
    res.render('house/houses', { houses });
});


router.get('/details/:id', async (req, res) => {

    try {
        const house = await req.storage.getHouseById(req.params.id);


        if (house.rented.length > 0) {
            house.rentedDetails = house.rented.map(b => b.fullName).join(', ');
        }

        if (req.user) {
            house.owner = req.user._id == house.owner._id;

            if (house.rented.length > 0) {
                house.renter = house.rented.some(b => b._id == req.user._id);
            }
        }

        house.hasPieces = false;
        if (house.pieces > 0) {
            house.openPieces = house.pieces;
        } else {
            house.hasNoPieces = true;
        }

        res.render('house/details', { house });
    } catch (err) {
        console.log(err)
        res.redirect('/404');
    }

});


router.get('/details/:id/join', isUser(), async (req, res) => {
    try {
        await req.storage.joinHouse(req.params.id, req.user._id);
        res.redirect('/house/details/' + req.params.id);
    } catch (err) {
        console.log(err);
        res.render('house/details');
    }

});



router.get('/edit/:id', isUser(), async (req, res) => {

    try {

        const house = await req.storage.getHouseById(req.params.id);

        if (house.owner._id != req.user._id) {
            throw new Error('Cannot edit house you haven\'t created');
        }

        res.render('house/edit', { house });

    } catch (err) {
        console.log(err)
        res.redirect('/house/details/' + req.params.id);
    }

});


router.post('/edit/:id', async (req, res) => {
    try {
        const house = await req.storage.getHouseById(req.params.id);

        if (house.owner._id != req.user._id) {
            throw new Error('Cannot edit house you haven\'t created');
        }

        await req.storage.editHouse(req.params.id, req.body);

        res.redirect('/house/details/' + req.params.id);

    } catch (err) {
        console.log(err)
        const ctx = {
            errors: parseError(err),
            house: {
                _id: req.params.id,
                name: req.body.name,
                type: req.body.type,
                year: req.body.year,
                city: req.body.city,
                homeImg: req.body.homeImg,
                description: req.body.description,
                pieces: Number(req.body.pieces)
            }
        };

        res.render('house/edit', ctx);
    }
});

// router.get('/search', async (req, res) => {

// });



router.get('/delete/:id', isUser(), async (req, res) => {
    try {
        const house = await req.storage.getHouseById(req.params.id);

        if (house.owner._id != req.user._id) {
            throw new Error('Cannot delete house you haven\'t created');
        }

        await req.storage.deleteHouse(req.params.id);
        res.redirect('/house/houses');
    } catch (err) {

        res.redirect('/house/details/' + req.params.id);
    }


});




module.exports = router;