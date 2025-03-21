import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import bcrypt from 'bcrypt';

// Load environment variables
dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/googlebooks');

const seedDatabase = async () => {
  try {
    // Hash the password before saving
    const hashedPassword = await bcrypt.hash('Test123!', 10);

    // Create a test user
    const user = new User({
      username: 'testuser',
      email: 'testuser@example.com',
      password: hashedPassword, // Store the hashed password
    });

    await user.save();
    console.log('✅ Test user seeded successfully!');

    // Close the connection after seeding
    mongoose.connection.close();
  } catch (error) {
    console.error('❌ Error seeding test user:', error);
    mongoose.connection.close();
  }
};

// Run the seed function
seedDatabase();
