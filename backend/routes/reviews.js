const router = require('express').Router();
const { getProductReviews, createReview, deleteReview } = require('../controllers/reviewController');
const { protect } = require('../middleware/auth');
router.get('/:productId', getProductReviews);
router.post('/', protect, createReview);
router.delete('/:id', protect, deleteReview);
module.exports = router;
