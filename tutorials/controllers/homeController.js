const router = require('express').Router();



router.get('/', async (req, res) => {
    const courses = await req.storage.getAllCourses();

    console.log(courses);
    res.render('home/home', { courses });
});




module.exports = router;