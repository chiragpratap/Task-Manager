const express = require('express');
const router = express.Router();
const { Signup, loginUser, getMe, getUsers } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/roleMiddleware');

router.post('/signup', Signup);
router.post('/login', loginUser);
router.get('/me', protect, getMe);
router.get('/users', protect, admin, getUsers);

module.exports = router;
