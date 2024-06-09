import "dotenv/config";
import passport from "passport";
import asyncHandler from "express-async-handler";
import { body, validationResult } from 'express-validator';
import bcrypt from "bcryptjs";
import User from '../models/user.mjs';


// GET
const index = asyncHandler(async (req, res, _) => {
  res.render('layout', {
    title: 'Index'
  });
});

const home = asyncHandler(async (req, res, _) => {
  const users = await User.find({}, 'username messages').populate('messages').exec();

  res.render('home', {
    users,
    title: 'Post'
  });
});

const secret_page = asyncHandler(async (req, res, _) => {
  res.send("Secret page: GET NOT IMPLEMENTED");
});

const profile = asyncHandler(async (req, res, _) => {
  res.send("Profile page: GET NOT IMPLEMENTED");
});

const register_get = asyncHandler(async (req, res, _) => {
  res.render('register_form', {
    title: 'Create your account'
  });
});

const login_get = asyncHandler(async (req, res, _) => {
  res.render('login_form', {
    title: 'Login'
  });
});

const logout_get = (req, res, next) => {
  req.session.destroy(err => {
    if(err) return next(err);

    res.redirect('/login');
  });

};

const delete_get = asyncHandler(async (req, res, _) => {
  res.send("Delete page: GET NOT IMPLEMENTED");
});

// POST
const register_post = [
  body('username')
  .trim()
  .isLength({ min: 3 })
  .withMessage(
    'Username must be greater than or equals to 3 characters'
  )
  .isLength( { max: 100 })
  .withMessage('Username must not be longer than 100 characters')
  .escape(),
  body('admin_password')
  .trim()
  .custom((val) => {
    if(!val) return true
    
    return val === process.env.ADMIN_PASSWORD
  })
  .withMessage('Incorrect admin password')
  .escape(),
  body('password')
  .trim()
  .isLength({ min: 8 })
  .withMessage('Password must at least contain 8 characters')
  .escape(),
  body('password_confirm')
  .trim()
  .custom((val, { req }) => val === req.body.password)
  .withMessage('Passwords does not match')
  ,
  (req, res, next) => {
    const errors = validationResult(req);

    if(!errors.isEmpty()) {
      return res.render('register_form', {
        title: 'Create your account',
        errors: errors.array()
      });
    }

    return bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
      try {
        const user = new User({
          username: req.body.username,
          password: hashedPassword,
        });

        if(err) {
          throw new Error(err)
        }
        
        if(req.body.admin_password === process.env.ADMIN_PASSWORD) {
          user.admin = true;
        }

        if(req.body.member_password === process.env.MEMBER_PASSWORD) {
          user.member = true;
        }

        await user.save();

        res.redirect('/login')
      } catch (error) {
          return next(error)
      }
    })
  }
  
];

const login_post = passport.authenticate('local', {
  successRedirect: '/home',
  failureRedirect: '/login',
  failureMessage: true,
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
