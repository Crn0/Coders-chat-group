import 'dotenv/config';
import asyncHandler from 'express-async-handler';
import { isValidObjectId } from 'mongoose';
import * as Authenticate from '../middlewares/authMiddleware.mjs';
import User from '../models/user.mjs';
import Message from '../models/message.mjs';
import { memberRank, postCount } from '../helpers/profileHelpers.mjs';

// GET

const profile = [
    Authenticate.isAuthProtectedRoute(true),
    asyncHandler(async (req, res, _) => {
        const { id } = req.params;
        const posts = {};

        if (!isValidObjectId(id)) {
            const error = new Error('ID is not a valid mongodb objectID');
            error.status = 400;
            return res.render('profile', {
                error,
                title: 'Profile',
            });
        }

        const user = await User.findById(id, 'username member admin').exec();

        if (user === null) {
            const error = new Error('User not found');
            error.status = 404;
            return res.render('profile', {
                error,
                title: 'Profile',
            });
        }

        if (user.admin || user.member) {
            // SORT BY DATE
            const secretMessages = await Message.find({
                author: id,
                secret: true,
            }).sort({ date: -1 }).exec();

            posts.secretMessages = secretMessages;
        }

        const messages = await Message.find({ author: id, secret: false })
            .sort({ date: -1 })
            .exec();

        posts.messages = messages;

        const rank = memberRank(user);
        const count = postCount(posts);

        res.render('profile', {
            user,
            posts,
            rank,
            count,
            title: 'Profile',
        });
    }),
];

const logout_get = [
    Authenticate.isAuthProtectedRoute(true, 'You are not login'),
    asyncHandler(async (req, res, next) => {
        req.session.destroy((err) => {
            if (err) return next(err);
    
            res.redirect('/');
        });
    })
];

const delete_get = [
    Authenticate.isAuthProtectedRoute(true),
    asyncHandler(async (req, res, _) => {
        const { id } = req.params;
        const user = await User.findById(id).exec();

        if (user === null) {
            const error = new Error('User not found');
            error.status = 404;

            return res.render('delete_account', {
                error,
                title: 'DELETE ACCOUNT',
            });
        }

        res.render('delete_account', {
            user,
            title: 'DELETE ACCOUNT',
        });
    }),
];

// POST

const delete_post = [
    Authenticate.isAuthProtectedRoute(true),
    asyncHandler(async (req, res, next) => {
        const { id } = req.params;

        await Message.deleteMany({ author: id }).exec();

        await User.findByIdAndDelete(id);

        if (res.locals.isAdmin) return res.redirect('/');

        req.session.destroy((err) => {
            if (err) return next(err);

            res.redirect('/');
        });
    }),
];

export {
    profile,
    delete_get,
    delete_post,
    logout_get,
};
