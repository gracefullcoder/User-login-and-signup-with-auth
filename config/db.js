const mongoose = require('mongoose');
const connectionString = process.env.MONGODB_URI

connectDB()
    .then(() => {
        console.log("Connection was successful");
    })
    .catch(err => console.log(err));

async function connectDB() {
    await mongoose.connect(connectionString);
}

module.exports = connectDB;