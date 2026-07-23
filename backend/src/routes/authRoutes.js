const express = require('express');
const router = express.Router();
const { authenticateTelegramUser, getMe, logout } = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/telegram', authenticateTelegramUser);
router.get('/me', authMiddleware, getMe);
router.post('/logout', authMiddleware, logout);

module.exports = router;