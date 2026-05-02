const mongoose = require('mongoose');
const User = require('../models/User');
const Project = require('../models/Project');
const bcrypt = require('bcryptjs');

const connectDB = async () => {
  try {
    let uri = process.env.MONGODB_URI;

    // Fallback to in-memory server if no URI is provided
    if (!uri) {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongoServer = await MongoMemoryServer.create();
      uri = mongoServer.getUri();
      console.log('Using in-memory MongoDB server');
    }

    await mongoose.connect(uri);
    console.log(`MongoDB Connected: ${uri.substring(0, 30)}...`);

    // Seed data — create a default admin and project if none exist
    const adminExists = await User.findOne({ email: 'admin@test.com' });
    if (!adminExists) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('password123', salt);
      const admin = await User.create({
        name: 'Demo Admin',
        email: 'admin@test.com',
        password: hashedPassword,
        role: 'Admin'
      });
      await Project.create({
        title: 'Demo Project',
        description: 'This is a persistent test project for members to see.',
        owner: admin._id
      });
      console.log('Seeded database with test Admin and Project');
    }

  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
