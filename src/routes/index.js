const adminRouter = require('./admin')
const homeRouter = require('./home')

function route(app) {
    app.use('/admin', adminRouter);

    app.use('/', homeRouter);
}

module.exports = route
