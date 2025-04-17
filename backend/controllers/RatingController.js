
const Product = require('../models/Product');
const Rating = require('../models/Rating');

const RatingController = {
    rateProduct: async (req, res) => {
        try {
            const { rating } = req.body;
            const productId = req.params.productId;
            const userId = req.user._id; 

         
            if (rating < 1 || rating > 5) {
                return res.status(400).json({ message: 'Rating must be between 1 and 5' });
            }
            const existingRating = await Rating.findOne({ product: productId, user: userId });

            if (existingRating) {
             
                existingRating.rating = rating;
                await existingRating.save();
            } else {
                
                const newRating = new Rating({
                    product: productId,
                    user: userId,
                    rating,
                });
                await newRating.save();
            }

            const ratings = await Rating.find({ product: productId });
            const totalRatings = ratings.length;
            const sumRatings = ratings.reduce((sum, rating) => sum + rating.rating, 0);
            const averageRating = totalRatings > 0 ? sumRatings / totalRatings : 0;

            await Product.findByIdAndUpdate(productId, { averageRating }); 

            res.status(200).json({ message: 'Rating submitted successfully' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Failed to submit rating' });
        }
    },
};

module.exports = RatingController;