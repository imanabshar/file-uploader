import bcrypt from 'bcryptjs';
import passport from 'passport';
import { prisma } from '../lib/prisma.js';
import { validationResult, matchedData } from 'express-validator';

function showSignUpForm(req, res) {
  res.render('signup');
}

function showLoginForm(req, res) {
  res.render('login');
}

async function postSignUpForm(req, res) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.render('signup', { errors: errors.array() });
    }

    const { firstName, lastName, email, username, password } = matchedData(req);

    const existingUser = await prisma.user.findUnique({
      where: { username },
    });

    //if username already exits
    if (existingUser) {
      return res.render('signup', {
        errors: [{ msg: 'username already exists' }],
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        username,
        email,
        password: passwordHash,
      },
    });

    req.logIn(user, (err) => {
      if (err) {
        console.error(err);
        return res.render('signup', {
          errors: [{ msg: 'Error logging in after sign up' }],
        });
      }
      res.redirect('/');
    });
  } catch (err) {
    console.error(err);
  }
}

async function postLoginForm(req, res, next) {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.render('login', { errors: errors.array() });
    }

    passport.authenticate('local', (err, user, info) => {
      if (err) return next(err);

      if (!user) {
        return res.render('login', {
          errors: [{ msg: info.message || 'Login failed' }],
        });
      }

      req.logIn(user, (err) => {
        if (err) return next(err);
        return res.redirect('/');
      });
    })(req, res, next);
  } catch (err) {
    console.error(err);
  }
}

function logout(req, res, next) {
  req.logout(function (err) {
    if (err) return next(err);
    res.redirect('/');
  });
}

export { showSignUpForm, showLoginForm, postSignUpForm, postLoginForm, logout };
