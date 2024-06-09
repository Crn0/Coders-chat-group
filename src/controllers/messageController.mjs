import asyncHandler from "express-async-handler";
import { body, validationResult } from 'express-validator';
import Message from '../models/message.mjs';
import * as Authenticate from '../middlewares/authMiddleware.mjs';


// GET
const new_get = [
  Authenticate.isAuthProtectedRoute(true),
  asyncHandler(async (req, res, _) => {
    res.render('message_form', {
      title: 'New Message'
    });
  })
];

// POST
const new_post = [
  body('title')
  .trim()
  .escape(),
  body('message')
  .trim()
  .escape(),

  asyncHandler( async (req, res, _) => {
    const id = res.locals.currentUser._id;
    const { title, message } = req.body;

    const newMessage = new Message({
      title,
      message,
      author: id
    });
    
    await newMessage.save();

    res.redirect('/');
  })
];

const delete_post = asyncHandler(async (req, res, _) => {
  res.send("Message delete: POST NOT IMPLEMENTED");
});

export { new_get, new_post, delete_post };
