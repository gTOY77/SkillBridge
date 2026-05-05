const Review = require('../models/Review');
const User = require('../models/User'); // We need this to update the expert's profile!

exports.createReview = async (req, res) => {
  try {
    const { expertId, rating, comment } = req.body;
    const clientId = req.userId; // Comes from auth middleware

    if (expertId === clientId) {
      return res.status(400).json({ success: false, message: "You cannot review yourself!" });
    }

    // 1. Create the new review
    const review = await Review.create({
      expert: expertId,
      client: clientId,
      rating,
      comment
    });

    // 2. Fetch ALL reviews for this expert to calculate the new average
    const allReviews = await Review.find({ expert: expertId });
    const totalReviews = allReviews.length;
    const averageRating = (allReviews.reduce((acc, item) => item.rating + acc, 0) / totalReviews).toFixed(1);

    // 3. Update the Expert's profile with the new numbers!
    await User.findByIdAndUpdate(expertId, {
      rating: averageRating,
      totalReviews: totalReviews
    });

    res.status(201).json({ success: true, message: 'Review submitted successfully!', review });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error adding review', error: error.message });
  }
};

// 2. Get all reviews for a specific expert (and calculate their average rating!)
exports.getExpertReviews = async (req, res) => {
  try {
    const { expertId } = req.params;
    
    // Find all reviews and grab the name of the client who wrote it
    const reviews = await Review.find({ expert: expertId })
      .populate('client', 'name') 
      .sort({ createdAt: -1 }); // Newest first

    // Calculate the average star rating
    const totalReviews = reviews.length;
    const averageRating = totalReviews > 0
      ? (reviews.reduce((acc, item) => item.rating + acc, 0) / totalReviews).toFixed(1)
      : 0;

    res.status(200).json({ 
      success: true, 
      reviews, 
      averageRating, 
      totalReviews 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching reviews', error: error.message });
  }
};