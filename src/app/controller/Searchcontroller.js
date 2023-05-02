const teacher = require('../model/User/Teacher/Teacher');
const student = require('../model/User/Student/Student');
const course = require('../model/User/Course/Course');
const lesson = require('../model/User/Lesson/Lesson');
const axios = require('axios');
const {mongooseToObject, mulMongooseToObject} = require('../../util/mongoose');
class SearchController {
    renderSearch(req, res) {
        res.render('search/renderSearch', {
            user: {
                id: req.params.id,
                title: req.params.title,
            },
            api: {
                axios: axios,
            },
        });
    }

    search(req, res) {
        if (req.body.keyword !== '') {
            course
                .find({
                    description: {
                        $regex: `^${req.body.keyword}`,
                        $options: 'i',
                    },
                })
                .then(course => {
                    res.json(course);
                });
        }
    }

    async searchKeyWord(req, res) {
        if (req.body.keyword !== '') {
            try {
                const allcourse = await course.find({
                    description: {
                        $regex: `^${req.body.keyword}`,
                        $options: 'i',
                    },
                });
                res.json(allcourse);
            } catch (error) {
                res.json(error);
            }
        }
    }
}
module.exports = new SearchController();
