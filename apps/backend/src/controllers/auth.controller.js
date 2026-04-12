const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { supabase } = require('../lib/supabase');
const { success, failure } = require('../utils/response');

const AUTH_COOKIE_NAME = 'admin_token';

function getCookieOptions() {
  const isProduction = process.env.NODE_ENV === 'production';

  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: '/',
  };
}

async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return failure(res, 400, 'VALIDATION_ERROR', 'Email and password are required');
    }

    const { data: user, error } = await supabase
      .from('users')
      .select('id, name, email, password, is_admin')
      .eq('email', email)
      .single();

    if (error || !user) {
      return failure(res, 401, 'INVALID_CREDENTIALS', 'Invalid email or password');
    }

    if (!user.is_admin) {
      return failure(res, 403, 'FORBIDDEN', 'Admin access only');
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return failure(res, 401, 'INVALID_CREDENTIALS', 'Invalid email or password');
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        isAdmin: user.is_admin,
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.cookie(AUTH_COOKIE_NAME, token, getCookieOptions());

    return success(res, {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        isAdmin: user.is_admin,
      },
    });
  } catch (error) {
    return failure(res, 500, 'LOGIN_FAILED', error.message);
  }
}

async function me(req, res) {
  try {
    return success(res, {
      user: {
        id: req.user.id,
        email: req.user.email,
        isAdmin: req.user.isAdmin,
      },
    });
  } catch (error) {
    return failure(res, 500, 'ME_FAILED', error.message);
  }
}

function logout(req, res) {
  res.clearCookie(AUTH_COOKIE_NAME, getCookieOptions());
  return success(res, { message: 'Logged out' });
}

module.exports = {
  login,
  me,
  logout,
};