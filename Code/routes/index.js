const commentsRoutes = require('./comments');
const customersRoutes = require('./customers');
const reviewsRoutes = require('./reviews');
const restaurantsRoutes = require('./restaurants');
const buyingRoutes = require('./buying');

const constructorMethod = (app) => {
    app.use('/comments', commentsRoutes);
    app.use('/', customersRoutes);
    app.use('/reviews', reviewsRoutes);
    app.use('/', restaurantsRoutes);
    app.use('/buying', buyingRoutes);

    app.use('*', (req, res) => {
        // console.log('here')
        res.redirect('/login')
    });
};

module.exports = constructorMethod;