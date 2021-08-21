const router = require('express').Router();


router.get('/', async (req, res) => {
        
   const houses = await req.storage.getLimitHouses();
    res.render('home/home', {houses});
});



module.exports = router;