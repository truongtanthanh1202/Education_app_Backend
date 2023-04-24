const mongoose = require('mongoose');
mongoose.set('strictQuery', true);

async function connect() {
  try {
    await mongoose.connect('mongodb://127.0.0.1/Test-project', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connect successfully!');
  } catch (error) {
    console.log('Connect failed!');
  }
}

module.exports = {connect};
