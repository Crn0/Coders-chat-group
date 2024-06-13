import 'dotenv/config';
import asyncHandler from 'express-async-handler';
import { body, validationResult } from 'express-validator';
import passport from 'passport';
import bcrypt from 'bcryptjs';
import * as Authenticate from '../middlewares/authMiddleware.mjs';
import User from '../models/user.mjs';
import Message from '../models/message.mjs';
import usernameExist from '../helpers/usernameExist.mjs';
import isPasswordMatch from '../helpers/passwordMatch.mjs';

// GET
const index = [
    Authenticate.isAuthProtectedRoute(false),
    (req, res, _) => {
        if (req.isAuthenticated()) return res.redirect('/minor_arcana');

        res.render('index', {
            title: 'Tarot Club',
        });
    },
];

const home = asyncHandler(async (req, res, _) => {
    const messages = await Message.find({ secret: false })
        .populate('author', 'username')
        .sort({ date: -1 })
        .exec();

    res.render('home', {
        messages,
        title: 'Minor Arcana',
    });
});

const secret_page = [
    Authenticate.isAuthProtectedRoute(true),
    Authenticate.isMemberOrAdmin,

    asyncHandler(async (req, res, _) => {
        const messages = await Message.find({ secret: true })
            .populate('author', 'username')
            .sort({ date: -1 })
            .exec();

        res.render('secret_page', {
            messages,
            title: 'Major Arcana',
        });
    }),
];

const register_get = [
    Authenticate.ifAuth((req, res, _) => res.redirect('/minor_arcana')),
    asyncHandler(async (req, res, _) => {
        res.render('register_form', {
            title: 'Register',
        });
    }),
];

const login_get = [
    Authenticate.ifAuth((req, res, _) => res.redirect('/minor_arcana')),
    asyncHandler(async (req, res, _) => {
        res.render('login_form', {
            title: 'login',
        });
    }),
];

// POST
const register_post = [
    Authenticate.ifAuth((req, res, _) => res.redirect('/')),
    body('username')
        .trim()
        .isLength({ min: 3 })
        .withMessage('Username must be minimum of 4 characters')
        .custom(usernameExist)
        .escape(),
    body('password').trim().escape(),
    body('password_confirm')
        .trim()
        .custom(isPasswordMatch)
        .withMessage('Passwords do not match')
        .escape(),
    body('admin_password').trim().escape(),
    body('member_password').trim().escape(),
    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.render('register_form', {
                title: 'Register',
                uname: req.body.username,
                errors: errors.array(),
            });
        }

        bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
            try {
                const user = new User({
                    username: req.body.username,
                    password: hashedPassword,
                });

                if (err) throw new Error(err);

                if (req.body.admin_password === process.env.ADMIN_PASSWORD) {
                    user.admin = true;
                }
                if (req.body.member_password === process.env.MEMBER_PASSWORD) {
                    user.member = true;
                }

                await user.save();

                req.login(user, (err) => {
                    if (err) return next(err);
                    if (user.member || user.admin)
                        return res.redirect('/major_arcana');

                    res.redirect('/minor_arcana');
                });
            } catch (error) {
                return next(error);
            }
        });
    }),
];

const login_post = [
    Authenticate.ifAuth((req, res, _) => res.redirect('/')),
    passport.authenticate('local', {
        successRedirect: '/minor_arcana',
        failureRedirect: '/login',
        failureMessage: 'Incorrect username or password',
    })
];

export {
    index,
    home,
    secret_page,
    register_get,
    login_get,
    register_post,
    login_post,
};