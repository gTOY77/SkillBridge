const express = require('express');
const router = express.Router();

const { createReview, getExpertReviews } = require('../controllers/reviewController');
const { auth } = require('../middleware/auth'); // Using the curly brackets just like we fixed earlier!

// POST a new review (Must be logged in to do this)
router.post('/', auth, createReview);

// GET all reviews for an expert (Anyone can view reviews)
router.get('/:expertId', getExpertReviews);

module.exports = router;