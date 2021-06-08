const { catalog } = require('../controllers/catalog');
const { about } = require('../controllers/about');
const { details } = require('../controllers/details');
const { create, post } = require('../controllers/create');
const { post: commentPost } = require('../controllers/comments');
const { notFound } = require('../controllers/notFound');

module.exports = (app) => {
    app.get('/', catalog);
    app.get('/about', about);
    app.get('/details/:id', details);
    app.get('/create', create);
    app.post('/create', post);

    app.post('/comments/:cubeId/create', commentPost);

    app.all('*', notFound);


};