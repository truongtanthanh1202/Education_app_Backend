const siteRouter = require('./site');
const meRouter = require('./me');
const teacherRouter = require('./teacher');
const studentRouter = require('./student');
const splashRouter = require('./splash');
const emailRouter = require('./email');
const searchRouter = require('./search');
function route(app) {
    app.use('/splash-screens', splashRouter);
    app.use('/teacher', teacherRouter);
    app.use('/student', studentRouter);
    app.use('/site', siteRouter);
    app.use('/me', meRouter);
    app.use('/check', emailRouter);
    app.use('/search', searchRouter);
    app.use('/', siteRouter);
}

module.exports = route;
