const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Validates raw Telegram initData string using SHA256 HMAC
 */
const verifyTelegramInitData = (telegramInitData) => {
  const urlParams = new URLSearchParams(telegramInitData);
  const hash = urlParams.get('hash');
  urlParams.delete('hash');

  const dataToCheck = [];
  urlParams.sort();
  for (const [key, value] of urlParams.entries()) {
    dataToCheck.push(`${key}=${value}`);
  }

  const secretKey = crypto
    .createHmac('sha256', 'WebAppData')
    .update(process.env.TELEGRAM_BOT_TOKEN)
    .digest();

  const calculatedHash = crypto
    .createHmac('sha256', secretKey)
    .update(dataToCheck.join('\n'))
    .digest('hex');

  return {
    isValid: calculatedHash === hash,
    userData: JSON.parse(urlParams.get('user') || '{}'),
  };
};

const authenticateTelegramUser = async (req, res) => {
  try {
    const { initDataRaw } = req.body;

    if (!initDataRaw) {
      return res.status(400).json({
        success: false,
        message: 'initDataRaw string is required.',
        data: null,
      });
    }

    const { isValid, userData } = verifyTelegramInitData(initDataRaw);

    if (!isValid || !userData.id) {
      return res.status(401).json({
        success: false,
        message: 'Invalid Telegram data signature.',
        data: null,
      });
    }

    let user = await User.findOne({ telegramId: userData.id.toString() });

    if (!user) {
      user = await User.create({
        telegramId: userData.id.toString(),
        firstName: userData.first_name || '',
        lastName: userData.last_name || '',
        username: userData.username || '',
        role: 'student', // Default role
      });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    res.cookie('jwt', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      message: 'Authentication successful.',
      data: {
        _id: user._id,
        telegramId: user.telegramId,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error during authentication.',
      data: null,
    });
  }
};

const getMe = async (req, res) => {
  return res.status(200).json({
    success: true,
    message: 'User profile retrieved.',
    data: req.user,
  });
};

const logout = async (req, res) => {
  res.clearCookie('jwt');
  return res.status(200).json({
    success: true,
    message: 'Logged out successfully.',
    data: null,
  });
};

module.exports = {
  authenticateTelegramUser,
  getMe,
  logout,
};