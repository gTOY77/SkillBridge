// 0. The Magic DNS Fix for Node.js!
const dns = require('node:dns/promises');
dns.setServers(['8.8.8.8', '1.1.1.1']);

// 1. Import all the tools we need
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// 2. Set up the Express App
const app = express();
app.use(cors());
app.use(express.json());

// 3. Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
.then(() => {
    console.log('🎉 Successfully connected to MongoDB Atlas!');
})
.catch((error) => {
    console.log('❌ Error connecting to MongoDB:', error.message);
});

// 4. A simple test route
app.get('/', (req, res) => {
res.send('SkillBridge Backend is running!');
});

// 5. Start the Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});