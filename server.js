// server.js

const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const bcrypt = require('bcryptjs');
const User = require('./models/User'); 
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// --- Middleware ---
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));

// --- CORRECTED CODE ORDER ---
// 1. Define the specific route for the homepage FIRST.
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'ex4.html'));
});

// 2. THEN, serve all other static files like CSS and images.
app.use(express.static(__dirname));
// ----------------------------

// --- MongoDB Connection ---
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ Successfully connected to MongoDB!');
    // Start the server only after the database connection is successful
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on http://localhost:${PORT}`);
    });
  })
  .catch(err => console.error('❌ Connection error', err));

// --- API Routes ---

// SIGNUP LOGIC: Handle new user registration
app.post('/signup', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      return res.send('<script>alert("An account with this email already exists."); window.location.href="/signup.html";</script>');
    }

    const newUser = new User({ username, email, password });
    await newUser.save(); // The 'pre-save' hook in User.js will hash the password

    // Redirect to the login page after successful signup
    res.redirect('/login.html'); 

  } catch (error) {
    res.status(500).send('Error creating user: ' + error.message);
  }
});

// LOGIN LOGIC: Handle user login and authentication
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid email or password.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Invalid email or password.' });
    }
    
    // SUCCESSFUL LOGIN: Send back a success message and the user ID
    res.json({ success: true, userId: user._id });

  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error: ' + error.message });
  }
});

// SAVE FOOTPRINT DATA: Save a calculation result to the user's history
app.post('/api/save-footprint', async (req, res) => {
    try {
        const { userId, totalEmissions, breakdown } = req.body;

        if (!userId) {
            return res.status(400).json({ message: 'User ID is required.' });
        }

        const newFootprintEntry = {
            totalEmissions: totalEmissions,
            breakdown: breakdown 
        };

        await User.findByIdAndUpdate(
            userId,
            { $push: { footprintHistory: newFootprintEntry } },
            { new: true }
        );

        res.status(200).json({ message: 'Footprint saved successfully!' });

    } catch (error) {
        res.status(500).json({ message: 'Server error: ' + error.message });
    }
});

// GET USER DATA: Fetch a user's profile info and footprint history
app.get('/api/user-data/:userId', async (req, res) => {
    try {
        const user = await User.findById(req.params.userId).select('-password'); // Exclude password from result
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({
            username: user.username,
            history: user.footprintHistory
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error: ' + error.message });
    }
});