const router = require('express').Router();
const userService = require('../services/user');
const { isUser } = require('../middlewares/guards');

const Hotel = require('../models/Hotel');



router.get('/', async (req, res) => {
    const hotels = await req.storage.getAllHotels();

    res.render('home/home', { hotels });
});

router.get('/user', isUser(), async (req, res) => {

    try {

        const profile = await userService.getUserByUsername(req.user.username);
        const id = profile._id;

        profile.reservations = [];

        const hotels = await Hotel.find({ bookedBy: id }).lean();
        
        hotels.map(h => profile.reservations.push(h.name));


        const ctx = {
            username: profile.username,
            email: profile.email,
            reservations: (profile.reservations).join(', ')
        };
        res.render('user/profile', ctx);

    } catch (err) {
        console.log(err);

        res.redirect('/auth/login');


    }
});

module.exports = router;
