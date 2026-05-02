const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // If your User model doesn't auto-hash
require('dotenv').config(); // This loads your database password from the .env file

// IMPORTANT: Adjust this path if your User model is saved somewhere else
const User = require('./models/User'); 

const seedAdmin = async () => {
  try {
    // 1. Connect to the database
    await mongoose.connect(process.env.MONGO_URI || process.env.DB_URL);
    console.log("Connected to database...");

    // 2. Check if an admin ALREADY exists
    const adminExists = await User.findOne({ role: 'admin' });
    if (adminExists) {
      console.log("🛑 Stop! An admin account already exists in the database.");
      console.log(`Admin email is: ${adminExists.email}`);
      process.exit(); // Quit the script
    }

    // 3. Create the ONE admin password (change 'admin123' to whatever you want)
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);

    // 4. Create the admin account
    await User.create({
      name: 'System Admin',
      email: 'admin@skillbridge.com', // You will use this to log in!
      password: hashedPassword,
      role: 'admin',
      status: 'Active'
    });

    console.log("✅ Success! Your one and only Admin account has been created.");
    process.exit(); // Quit the script

  } catch (error) {
    console.error("❌ Error creating admin:", error);
    process.exit(1);
  }
};

seedAdmin();