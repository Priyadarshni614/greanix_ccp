const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true, // No two users can share the same email
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  // To store footprint data later
  footprintHistory: [{
    date: { type: Date, default: Date.now },
    totalEmissions: Number,
    breakdown: {
      homeEnergy: Number,
      transportation: Number,
      consumption: Number
    }
  }]
});

// Hash the password before saving the user model
userSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

const User = mongoose.model('User', userSchema);
module.exports = User;