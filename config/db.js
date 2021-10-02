const mongoose = require('mongoose');

const connection = async () => {
    try {
        await mongoose.connect(process.env.URL).then(() => {
            console.log("Connected Successfully");
        }).catch(err => console.log(err));
    } catch (error) {
        console.log(error);
    }
}

module.exports = connection;