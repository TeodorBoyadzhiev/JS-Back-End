const router = require('express').Router();
const { isUser } = require('../middlewares/guards');
const { parseError } = require('../util/parsers');

const userService = require('../services/user');


router.get('/create', isUser(), (req, res) => {
    res.render('course/create');
});


router.post('/create', isUser(), async (req, res) => {
    try {

        const courseData = {
            title: req.body.title,
            description: req.body.description,
            imageUrl: req.body.imageUrl,
            duration: req.body.duration,
            createdBy: req.user._id,
        };

        await req.storage.createCourse(courseData);

        res.redirect('/');
    } catch (err) {

        console.log(err);
        console.log(err.errors);
        const ctx = {
            errors: parseError(err),
            courseData: {
                title: req.body.title,
                description: req.body.description,
                imageUrl: req.body.imageUrl,
                duration: req.body.duration
            }
        };

        res.render('course/create', ctx);
    }

});

router.get('/details/:id', isUser(), async (req, res) => {
    try {
        const course = await req.storage.getCourseById(req.params.id);

        course.hasUser = Boolean(req.user);

        if (course.usersEnrolled == undefined) {
            course.isEnrolled = false;

        } else {
            course.isEnrolled = req.user && req.user._id == course.usersEnrolled.find(u => u._id == req.user._id);
        }


        course.isOwner = req.user && req.user._id == course.createdBy._id;

        res.render('course/details', { course });
    } catch (err) {
        console.log(err.message);
        res.redirect('/');
    }
});

router.get('/enroll/details/:id', isUser(), async (req, res) => {

    try {
        const course = await req.storage.getCourseById(req.params.id);

        if (course.usersEnrolled.find(u => u._id == req.user._id)) {
            course.isEnrolled = true;
            throw new Error('You already enroll this course');
        }

        await req.storage.enrollCourse(req.user._id, req.params.id);

        res.redirect('/course/details/' + req.params.id);
    } catch (err) {

        console.log(err);
        res.redirect('/course/details/' + req.params.id);


    }

});

router.get('/edit/:id', isUser(), async (req, res) => {
    try {
        const course = await req.storage.getCourseById(req.params.id);


        res.render('course/edit', { course });


    } catch (err) {
        console.log(err)
        res.redirect('/course/edit/' + req.params.id);
    }
});

router.post('/edit/:id', isUser(), async (req, res) => {
    try {
        const course = await req.storage.getCourseById(req.params.id);

        // if (hotel.owner != req.user._id) {
        //     throw new Error('You can\'t edit this hotel!');
        // }

        await req.storage.editCourse(req.params.id, req.body);
        res.redirect('/course/details/' + req.params.id);


    } catch (err) {
        console.log(err)
        const ctx = {
            errors: parseError(err),
            course: {
                _id: req.params.id,
                title: req.body.title,
                description: req.body.description,
                imageUrl: req.body.imageUrl,
                duration: req.body.duration
            }
        };

        res.render('course/edit', ctx);
    }
});


router.get('/delete/:id', async (req, res) => {
    try {
        
        await req.storage.deleteCourse(req.params.id);

        res.redirect('/');
    } catch (err) {
        console.log(err);
        res.redirect('/course/details/' + req.params.id);
    }
});



module.exports = router;