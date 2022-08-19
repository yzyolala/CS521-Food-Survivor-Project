const commentsRoutes = require('./comments');
const customersRoutes = require('./customers');
const reviewsRoutes = require('./reviews');
const restaurantsRoutes = require('./restaurants');

const constructorMethod = (app) => {
    app.use('/comments', commentsRoutes);
    app.use('', customersRoutes);
    app.use('/reviews', reviewsRoutes);
    app.use('/', restaurantsRoutes);

    app.use('*', (req, res) => {
        console.log('here')
        res.status(404).json({ error: 'Not found' });
    });
};

module.exports = constructorMethod;