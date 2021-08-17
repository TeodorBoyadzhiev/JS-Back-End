const router = require('express').Router();
const { isUser } = require('../middlewares/guards');
const { parseError } = require('../util/parsers');


router.get('/create', isUser(), (req, res) => {
    res.render('trip/create');
});


router.post('/create', isUser(), async (req, res) => {
    try {

        const tripData = {
            startPoint: req.body.startPoint,
            endPoint: req.body.endPoint,
            date: req.body.date,
            time: req.body.time,
            carImage: req.body.carImage,
            carBrand: req.body.carBrand,
            seats: Number(req.body.seats),
            price: Number(req.body.price),
            description: req.body.description,
            creator: req.user._id,
        };


        await req.storage.createTrip(tripData);

        res.redirect('/trip/trips');
    } catch (err) {
        console.log(err);
        const ctx = {
            errors: parseError(err),
            tripData: {
                startPoint: req.body.startPoint,
                endPoint: req.body.endPoint,
                date: req.body.date,
                time: req.body.time,
                carImage: req.body.carImage,
                carBrand: req.body.carBrand,
                seats: req.body.seats,
                price: req.body.price,
                description: req.body.description
            }
        };
        res.render('trip/create', ctx);
    }


});


router.get('/trips', async (req, res) => {

    const trips = await req.storage.getAllTrips();
    res.render('SharedTrips', { trips });
});


router.get('/details/:id', async (req, res) => {

    try {
        const trip = await req.storage.getTripById(req.params.id);

        const seatsLeft = Number(trip.seats) - Number((trip.buddies).length);

        if (seatsLeft > 0) {
            trip.seatsLeft = seatsLeft;
        } else {
            trip.seatsLeft = 0;
        }


        trip.isAuthor = req.user && req.user._id == trip.creator;
        trip.buddie = req.user && trip.buddies.find(b => b._id == req.user._id);

        console.log(trip)

        if (trip.buddies.length < 1) {
            trip.buddies = false;
        }

        res.render('trip/details', { trip });
    } catch (err) {
        console.log(err)
        res.redirect('/404');
    }

});



router.get('/edit/:id', isUser(), async (req, res) => {

    try {

        const trip = await req.storage.getTripById(req.params.id);

        if (trip.creator != req.user._id) {
            throw new Error('Cannot edit trip you haven\'t created');
        }

        res.render('trip/edit', { trip });

    } catch (err) {
        console.log(err)
        res.redirect('/trip/details/' + req.params.id);
    }

});


router.post('/edit/:id', async (req, res) => {
    console.log('trip')
    try {
        const trip = await req.storage.getTripById(req.params.id);

        console.log(trip)
        if (trip.creator != req.user._id) {
            throw new Error('Cannot edit trip you haven\'t created');
        }

        await req.storage.editTrip(req.params.id, req.body);

        res.redirect('/trip/details/' + req.params.id);

    } catch (err) {
        console.log(err)
        const ctx = {
            errors: parseError(err),
            trip: {
                _id: req.params.id,
                startPoint: req.body.startPoint,
                endPoint: req.body.endPoint,
                date: req.body.date,
                time: req.body.time,
                carImage: req.body.carImage,
                carBrand: req.body.carBrand,
                seats: Number(req.body.seats),
                price: Number(req.body.price),
                description: req.body.description,
            }
        };

        res.render('trip/edit', ctx);
    }
});



router.get('/delete/:id', isUser(), async (req, res) => {
    try {
        const trip = await req.storage.getTripById(req.params.id);

        if (trip.creator != req.user._id) {
            throw new Error('Cannot delete trip you haven\'t created');
        }

        await req.storage.deleteTrip(req.params.id);
        res.redirect('/trip/trips');
    } catch (err) {

        res.redirect('/trip/details/' + req.params.id);
    }


});




module.exports = router;