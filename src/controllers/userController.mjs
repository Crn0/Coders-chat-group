import 'dotenv/config';
import asyncHandler from "express-async-handler";
import { body, validationResult } from 'express-validator';
import passport from "passport";
import bcrypt from "bcryptjs";
import * as Authenticate from '../middlewares/authMiddleware.mjs';
import User from '../models/user.mjs';
import usernameExist from "../helpers/usernameExist.mjs";
import isPasswordMatch from '../helpers/passwordMatch.mjs';

// GET
const index = [
  Authenticate.isAuth(false),
  (req, res, _) => {
    if(req.isAuthenticated()) return res.redirect('/minor_arcana');
  
    res.render('index', {
      title: 'Tarot Club'
    });
  }
];

const home = asyncHandler(async (req, res, _) => {
  res.send("<a href='/logout'>Logout<a/>");
});

const secret_page = asyncHandler(async (req, res, _) => {
  res.send("<a href='/logout'>Logout<a/>");
});

const profile = asyncHandler(async (req, res, _) => {
  res.send("Profile page: GET NOT IMPLEMENTED");
});

const register_get = [
  Authenticate.ifAuth((req, res, _) => res.redirect('/minor_arcana')),
  (req, res, _) => {

    res.render('register_form', {
      title: 'Register'
    });
  }
];

const login_get = asyncHandler(async (req, res, _) => {
  res.render('login_form', {
    title: 'login'
  });
});

const logout_get = asyncHandler(async (req, res, next) => {
  req.session.destroy(err => {
    if(err) return next(err);

    res.redirect('/')
  });
});

const delete_get = asyncHandler(async (req, res, _) => {
  res.send("Delete page: GET NOT IMPLEMENTED");
});

// POST
const register_post = [
  body('username')
  .trim()
  .isLength({ min: 3 })
  .withMessage('Username must be minimum of 4 characters')
  .custom(usernameExist)
  .escape(),
  body('password')
  .trim()
  .escape(),
  body('password_confirm')
  .trim()
  .custom(isPasswordMatch)
  .withMessage('Passwords do not match')
  .escape(),
  body('admin_password')
  .trim()
  .escape(),
  body('member_password')
  .trim()
  .escape(),
  asyncHandler( async (req, res, next) => {
    const errors = validationResult(req);
    
    if(!errors.isEmpty()) {
      return res.render('register_form', {
        title: 'Register',
        uname: req.body.username,
        errors: errors.array()
      });
    }

    bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
      try {
        const user = new User({
          username: req.body.username,
          password: hashedPassword,
        });

        if(err) throw new Error(err);

        if(req.body.admin_password === process.env.ADMIN_PASSWORD) {
          user.admin = true;
        }
        if(req.body.member_password === process.env.MEMBER_PASSWORD) {
          user.member = true;
        }

        await user.save();

        req.login(user, (err) => {
          if(err) return next(err);
          if(user.member || user.admin) return res.redirect('/major_arcana')

          res.redirect('/minor_arcana')
        })
      } catch (error) {
        return next(error);
      }
    })
  })
];

const login_post = passport.authenticate('local', {
  successRedirect: '/minor_arcana',
  failureRedirect: '/login',
  failureMessage: 'Incorrect username or password',
});

const delete_post = asyncHandler(async (req, res, _) => {
  res.send("Delete page: POST NOT IMPLEMENTED");
});

export {
  index,
  home,
  secret_page,
  profile,
  register_get,
  login_get,
  delete_get,
  register_post,
  login_post,
  delete_post,
  logout_get,
};
