const router = require('express').Router();
const { isUser } = require('../middlewares/guards');
const { parseError } = require('../util/parsers');

router.get('/create', isUser(), (req, res) => {
    res.render('hotel/create');
});


router.post('/create', isUser(), async (req, res) => {
    try {

        const hotelData = {
            name: req.body.name,
            city: req.body.city,
            imageUrl: req.body.imageUrl,
            rooms: req.body.rooms,
            bookedBy: [],
            owner: req.user._id
        };

        await req.storage.createHotel(hotelData);

        res.redirect('/');
    } catch (err) {

        console.log(err);
        console.log(err.errors)
        const ctx = {
            errors: parseError(err),
            hotelData: {
                name: req.body.name,
                city: req.body.city,
                imageUrl: req.body.imageUrl,
                rooms: req.body.rooms,
            }
        };

        res.render('hotel/create', ctx);
    }

});

router.get('/details/:id', isUser(), async (req, res) => {
    try {
        const hotel = await req.storage.getHotelById(req.params.id);

        hotel.hasUser = Boolean(req.user);
        hotel.isOwner = req.user && req.user._id == hotel.owner;
        hotel.isBooked = req.user && req.user._id == hotel.bookedBy.find(u => u._id == req.user._id);

        res.render('hotel/details', { hotel });
    } catch (err) {
        console.log(err.message);
        res.redirect('/');
    }
});

router.get('/book/:id', isUser(), async (req, res) => {

    try {
        const hotel = await req.storage.getHotelById(req.params.id);

        if (hotel.owner == req.user._id) {
            throw new Error('You cannot book your own hotel!');
        }

        await req.storage.bookHotel(req.user._id, req.params.id);

        res.redirect('/hotel/details/' + req.params.id);


    } catch (err) {

console.log(err)
        res.redirect('/hotel/details/' + req.params.id);


    }

});

router.get('/edit/:id', isUser(), async (req, res) => {
    try {
        const hotel = await req.storage.getHotelById(req.params.id);

        if (hotel.owner != req.user._id) {
            throw new Error('You can\'t edit this hotel!');
        }

        res.render('hotel/edit', { hotel });


    } catch (err) {
        res.redirect('/hotel/edit/' + req.params.id);
    }
});

router.post('/edit/:id', isUser(), async (req, res) => {
    try {
        const hotel = await req.storage.getHotelById(req.params.id);

        if (hotel.owner != req.user._id) {
            throw new Error('You can\'t edit this hotel!');
        }

        await req.storage.editHotel(req.params.id, req.body);
        res.redirect('/hotel/details/' + req.params.id);


    } catch (err) {

        const ctx = {
            errors: parseError(err),
            hotel: {
                _id: req.params.id,
                name: req.body.name,
                city: req.body.city,
                imageUrl: req.body.imageUrl,
                rooms: req.body.rooms
            }
        };

        res.render('hotel/edit', ctx);
    }
});


router.get('/delete/:id', async (req, res) => {
    try {
        const hotel = await req.storage.getHotelById(req.params.id);

        if (hotel.owner != req.user._id) {
            throw new Error('Cannot delete hotel you haven\'t created');
        }

        await req.storage.deleteHotel(req.params.id);
        res.redirect('/');
    } catch (err) {
        console.log(err);
        res.redirect('/play/details/' + req.params.id);
    }
});



module.exports = router;
