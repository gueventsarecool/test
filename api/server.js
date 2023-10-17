// Import required libraries and modules
const express = require('express'); // Import Express.js framework
const mongoose = require('mongoose'); // Import Mongoose for MongoDB
const cors = require('cors'); // Import CORS middleware for handling cross-origin requests

const app = express(); // Create an Express application instance

// Middleware setup
app.use(express.json()); // Parse JSON request bodies
app.use(cors()); // Enable Cross-Origin Resource Sharing

// Connect to MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/cars", {
    useNewUrlParser: true, // Use new URL parser
    useUnifiedTopology: true // Use new server discovery and monitoring engine
}).then(() => console.log("Connected to DB!")).catch(err => console.error);

// Import Car model from the 'models' directory
const Car = require('./models/Car');

// Define routes and their handlers

// GET request to retrieve all cars
app.get('/cars', async (req, res) => {
    const cars = await Car.find();
    res.json(cars);
});

// POST request to create a new car
app.post('/car/new', (req, res) => {
    const car = new Car({
        carName: req.body.carName,
        speed: req.body.speed
    });
    car.save();
    res.json(car);
});

// DELETE request to delete a car by its ID
app.delete('/car/delete/:id', async (req, res) => {
    const result = await Car.findByIdAndDelete(req.params.id);
    res.json(result);
});

// GET request to toggle the 'choose' property of a car by its ID
app.get('/car/choose/:id', async (req, res) => {
    const carId = req.params.id;

    try {
        // Attempt to find the car by ID
        let car = await Car.findById(carId);

        // If the car doesn't exist, create a new entry with the provided ID
        if (!car) {
            car = new Car({
                _id: carId, // Set the ID explicitly
                carName: req.body.carName, // Use the data from the request body
                speed: req.body.speed // Use the data from the request body
            });
        }

        // Toggle the 'choose' property and save the car
        car.choose = !car.choose;
        await car.save();

        res.json(car);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred' });
    }
});

// GET request to retrieve all cars sorted by speed in descending order
app.get('/cars/sortCarsBySpeed', async (req, res) => {
    const cars = await Car.find().sort('-speed'); // Sort by speed in descending order
    res.json(cars);
});

// Start the Express server on port 3001
app.listen(3001, () => console.log("Server is running on port 3001!"));