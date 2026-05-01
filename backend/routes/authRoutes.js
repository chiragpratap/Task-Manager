const express = require('express');
const router = express.Router();
const { Signup, loginUser, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/signup', Signup);
router.post('/login', loginUser);
router.get('/me', protect, getMe);

module.exports = router;
