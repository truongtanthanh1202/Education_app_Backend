const mongoose = require('mongoose');
mongoose.set('strictQuery', true);

function connect() {
    try {
        mongoose.connect('mongodb://127.0.0.1/Test-project', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Connect successfully!');
    } catch (error) {
        console.log('Connect failed!');
    }
}

module.exports = {connect};
