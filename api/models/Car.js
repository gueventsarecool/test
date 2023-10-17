// Importing the mongoose library
const mongoose = require('mongoose');

// Creating a Schema object using mongoose
const Schema = mongoose.Schema;

// Defining a schema for a "todo" document in MongoDB
const carSchema = new Schema({
    carName: {
        type: String,
        required: true // carName is a required field
    },
    choose: {
        type: Boolean,
        default: false // choose defaults to false if not provided
    },
    speed: {
        type: Number,
        required: true // speed is a required field
    },
    timestamp: {
        type: String,
        default: Date.now() // timestamp defaults to the current date and time
    }
});

// Creating a Todo model based on the todoSchema
const Car = mongoose.model('Car', carSchema);

// Exporting the Todo model for use in other parts of the application
module.exports = Car;